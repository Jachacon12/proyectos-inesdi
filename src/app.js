const express = require('express');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
