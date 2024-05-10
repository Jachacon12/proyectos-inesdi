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
      completed: false
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
