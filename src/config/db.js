// src/config/db.js
const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URL || 'mongodb://mongo:27017/todoapp';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
