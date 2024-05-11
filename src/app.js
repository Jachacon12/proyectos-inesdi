const express = require('express');

/**
 * Function to connect to the database.
 * @type {Function}
 */
const connectDB = require('./config/db');

/**
 * Todo routes for express application.
 * @type {express.Router}
 */
const todoRoutes = require('./routes/todos');

/**
 * Port number for the express application.
 * @type {number}
 */
const PORT = process.env.PORT || 3000;

/**
 * Express application.
 * @type {express.Express}
 */
const app = express();

/**
 * Middleware to parse JSON bodies.
 */
app.use(express.json());

/**
 * Middleware for todo routes.
 */
app.use('/todos', todoRoutes);

/**
 * Start the server on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Connect to the database.
 */
connectDB();
