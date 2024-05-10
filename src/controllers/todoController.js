const Todo = require('../models/todo');

// Fetch todos based on optional query parameters
exports.getTodos = async (req, res) => {
  const query = req.query || {};

  try {
    const todos = await Todo.find(query); // Uses the constructed query to filter todos
    res.send(todos);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Handle creating a new todo
exports.createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      completed: false,
    });
    await newTodo.save();
    res.status(201).send(newTodo);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update todos based on ID or a general condition
exports.updateTodos = async (req, res) => {
  try {
    if (req.params.id) {
      // Update a single todo by ID
      const updates = req.body;
      const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      if (!todo) {
        return res.status(404).send('Todo not found.');
      }
      res.send(todo);
    } else if (req.query && Object.keys(req.query).length !== 0) {
      // Update multiple todos based on query conditions
      const updates = req.body;
      const result = await Todo.updateMany(req.query, updates);
      if (result.nModified === 0) {
        return res.status(404).send('No todos matched your query.');
      }
      res.send(`Updated ${result.nModified} todos successfully.`);
    } else {
      res
        .status(400)
        .send('No ID or valid query parameters provided for updating.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Handle deleting a todo
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).send();
    }
    res.send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Handle replacing or creating a todo
exports.replaceOrCreateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await Todo.findById(id);
    if (todo) {
      todo.title = title;
      todo.completed = completed === undefined ? todo.completed : completed;
      await todo.save();
      res.send(todo);
    } else {
      const newTodo = new Todo({
        _id: id,
        title,
        completed,
      });
      await newTodo.save();
      res.status(201).send(newTodo);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
