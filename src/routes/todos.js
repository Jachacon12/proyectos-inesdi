const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.patch('/:id?', todoController.updateTodos);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id', todoController.replaceOrCreateTodo);

module.exports = router;
