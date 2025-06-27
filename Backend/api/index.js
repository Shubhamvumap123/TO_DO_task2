const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

// Load env variables
dotenv.config();

const authRoutes = require('../src/routes/authRoutes');
const taskRoutes = require('../src/routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Conditionally run local server
if (require.main === module) {
  connectDB().then(() => {
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  });
} else {
  connectDB(); 
}

module.exports = serverless(app);
