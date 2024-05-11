const mongoose = require('mongoose');

/**
 * Todo model.
 * @type {mongoose.Model}
 */
const Todo = require('../models/todo');

/**
 * Function to connect to the database.
 * @type {Function}
 */
const connectDB = require('../config/db');

/**
 * Sample data to insert into database.
 * @type {Array.<{title: string, completed: boolean}>}
 */
const todos = [
  { title: 'Grocery shopping', completed: false },
  { title: 'Finish Node.js project', completed: true },
  { title: 'Write blog post', completed: false },
];

// Connect to MongoDB
connectDB();

/**
 * Insert sample data into database.
 * @type {Promise}
 */
Todo.insertMany(todos)
  .then(() => {
    console.log('Data inserted'); // Success message
    mongoose.connection.close(); // Close the connection when done
  })
  .catch(error => {
    console.error('Error inserting data:', error);
    mongoose.connection.close(); // Close the connection on error
  });
