const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('../src/routes/authRoutes');
const taskRoutes = require('../src/routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1); // Exit on DB connection failure
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start local server if not in serverless (e.g., dev mode)
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  });
} else {
  connectDB(); // Vercel will invoke the handler
}

module.exports = serverless(app);
