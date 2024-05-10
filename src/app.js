const express = require('express');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');

const app = express();
app.use(express.json());

connectDB();

app.use('/todos', todoRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
