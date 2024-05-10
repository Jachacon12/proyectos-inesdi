const Todo = require('../models/todo');

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title
    });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
