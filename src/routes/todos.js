const express = require('express');
/**
 * Express router to mount todo related functions on.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Controller methods for todo operations.
 * @type {Object}
 */
const todoController = require('../controllers/todoController');

/**
 * Route serving a POST request to create a new todo.
 * @name post/
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/', todoController.createTodo);

/**
 * Route serving a GET request to fetch todos.
 * @name get/:id?
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id?', todoController.getTodos);

/**
 * Route serving a PATCH request to update todos.
 * @name patch/:id?
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.patch('/:id?', todoController.updateTodos);

/**
 * Route serving a DELETE request to delete todos.
 * @name delete/:id?
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete('/:id?', todoController.deleteTodos);

/**
 * Route serving a PUT request to replace or create a todo.
 * @name put/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id', todoController.replaceOrCreateTodo);

module.exports = router;
