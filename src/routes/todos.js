const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.post('/', todoController.createTodo);
router.get('/:id?', todoController.getTodos);
router.patch('/:id?', todoController.updateTodos);
router.delete('/:id?', todoController.deleteTodos);
router.put('/:id', todoController.replaceOrCreateTodo);

module.exports = router;
