const mongoose = require('mongoose');

/**
 * Schema for Todo.
 * @type {mongoose.Schema}
 */
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

/**
 * Model for Todo.
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Todo', todoSchema);
