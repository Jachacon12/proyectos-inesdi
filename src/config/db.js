const mongoose = require('mongoose');

/**
 * MongoDB connection URI.
 * @type {string}
 */
const dbURI = process.env.MONGO_URL || 'mongodb://mongo:27017/todoapp';

/**
 * Connect to MongoDB.
 * @async
 * @function
 * @throws Will throw an error if it failed to connect to MongoDB.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
