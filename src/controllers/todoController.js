const Todo = require('../models/todo');
const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 204,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Validates the incoming request based on the presence of parameters or query.
 * @param {Object} req - The request object from Express.
 * @returns {Object} An object indicating if the request is valid and any applicable filter.
 */
const validateRequest = req => {
  if (req.params.id) {
    return { isValid: true, filter: { _id: req.params.id } };
  } else if (req.query && Object.keys(req.query).length !== 0) {
    return { isValid: true, filter: req.query };
  }
  return { isValid: false, filter: null };
};

/**
 * Error handling middleware that wraps async route handlers and centralizes error handling.
 * @param {Function} fn - The async function representing the route handler.
 * @returns {Function} A function that executes the route handler and handles any errors that occur.
 */
function catchErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(error => {
      console.error(error); // Log the error for debugging purposes
      if (error.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ error: 'Validation Error', details: error.errors });
      } else if (error.name === 'CastError') {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Invalid ID' });
      } else {
        res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ error: 'Server Error' });
      }
    });
  };
}

/**
 * Handles common operations like update and delete, and returns the appropriate HTTP response.
 * @param {Function} operation - Database operation function (update, delete).
 * @param {Object} req - Request object from Express.
 * @param {Object} res - Response object from Express.
 * @param {string} successMessage - Message to send on successful operation.
 */
const handleOperation = async (
  operation,
  req,
  res,
  successMessage,
  isDeleteOperation = false
) => {
  try {
    const { isValid, filter } = validateRequest(req);
    if (!isValid) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: 'No ID or valid query parameters provided.' });
    }

    const result = await operation(filter, req.body);
    let affectedCount = isDeleteOperation
      ? result.deletedCount
      : result.nModified;

    // Check if any documents were affected
    if (!result || affectedCount === 0) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        message: !result ? 'Todo not found.' : 'No todos matched your query.',
      });
    }

    res.status(HTTP_STATUS_CODES.OK).json({
      message: `${successMessage} ${affectedCount} todo(s) successfully.`,
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred while processing your request.',
      error: error.message,
    });
  }
};

// Below are specific functions to create, get, update, delete, and replace Todos, using the middleware and helper functions defined above.

// Each function is wrapped with the `catchErrors` middleware to ensure error handling is consistent and any thrown errors are caught and processed appropriately.

// Create a new Todo or multiple Todos based on request body
exports.createTodo = catchErrors(async (req, res) => {
  if (Array.isArray(req.body)) {
    // Bulk create Todos if an array of todos is provided
    const todos = await Todo.insertMany(req.body);
    res.status(201).send(todos);
  } else {
    // Create a single Todo
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).send(newTodo);
  }
});

// Get Todos by ID or by query conditions
exports.getTodos = catchErrors(async (req, res) => {
  if (req.params.id) {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }
    res.send(todo);
  } else {
    const todos = await Todo.find(req.query);
    res.send(todos);
  }
});

// Update Todos by ID or by query conditions
exports.updateTodos = catchErrors((req, res) => {
  return handleOperation(Todo.updateMany.bind(Todo), req, res, 'Updated');
});

// Delete Todos by ID or by query conditions
exports.deleteTodos = catchErrors((req, res) => {
  return handleOperation(Todo.deleteMany.bind(Todo), req, res, 'Deleted', true);
});

// Replace or create a Todo by ID
exports.replaceOrCreateTodo = catchErrors(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const todo = await Todo.findById(id);
  if (todo) {
    // Update the todo if it exists
    todo.title = data.title;
    todo.completed =
      data.completed !== undefined ? data.completed : todo.completed;
    await todo.save();
    res.status(200).send(todo);
  } else {
    // Create a new todo if it does not exist
    const newTodo = new Todo({
      _id: id, // Explicitly set the ID to the one provided
      title: data.title,
      completed: data.completed,
    });
    await newTodo.save();
    res.status(201).send(newTodo);
  }
});
