
const Todo = require('../models/todo');
const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const validateRequest = (req) => {
  if (req.params.id) {
    return { isValid: true, filter: { _id: req.params.id } };
  } else if (req.query && Object.keys(req.query).length !== 0) {
    return { isValid: true, filter: req.query };
  } else {
    return { isValid: false, filter: null };
  }
};

// Higher-order function for error handling
function catchErrors(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch((error) => {
      if (error.name === 'ValidationError') {
        // If it's a validation error, send a 400 response with the validation errors
        res.status(400).json({ error: 'Validation Error', details: error.errors });
      } else if (error.name === 'CastError') {
        // If it's a cast error (invalid ObjectId), send a 400 response
        res.status(400).json({ error: 'Invalid ID' });
      } else {
        // For any other type of error, send a 500 response with a generic error message
        res.status(500).json({ error: 'Server Error' });
        // Log the error for debugging purposes
        console.error(error);
      }
    });
  };
}


// Helper function for update and delete operations
const handleOperation = async (operation, req, res, successMessage) => {
  try {
    const { isValid, filter } = validateRequest(req);

    if (!isValid) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "No ID or valid query parameters provided." });
    }

    const result = await operation(filter, req.body);

    if (!result || result.nModified === 0) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: !result ? "Todo not found." : "No todos matched your query." });
    }

    res.status(HTTP_STATUS_CODES.OK).json({
      message: `${successMessage} ${result.nModified || 1} todo(s) successfully.`,
      data: result
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while processing your request.", error: error.message });
  }
};


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
      return res.status(404).send("Todo not found.");
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
  return handleOperation(Todo.deleteMany.bind(Todo), req, res, 'Deleted');
});

// Replace or create a Todo by ID
exports.replaceOrCreateTodo = catchErrors(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const todo = await Todo.findById(id);
  if (todo) {
    // Update the todo if it exists
    todo.title = data.title;
    todo.completed = data.completed !== undefined ? data.completed : todo.completed;
    await todo.save();
    res.send(todo);
  } else {
    // Create a new todo if it does not exist
    const newTodo = new Todo({
      _id: id, // Explicitly set the ID to the one provided
      title: data.title,
      completed: data.completed
    });
    await newTodo.save();
    res.status(201).send(newTodo);
  }
});