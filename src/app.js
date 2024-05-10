const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.send(todo);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
