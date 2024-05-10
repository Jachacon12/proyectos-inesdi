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
