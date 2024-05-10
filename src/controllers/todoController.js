const Todo = require('../models/todo');

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
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

// Handle updating a todo
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
    if (!todo) {
      return res.status(404).send();
    }
    res.send(todo);
  } catch (error) {
    res.status(400).send(error);
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
        completed
      });
      await newTodo.save();
      res.status(201).send(newTodo);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};