const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

/**
 * Express Server for College Events API
 * 
 * This is the main server file that:
 * 1. Connects to MongoDB
 * 2. Sets up middleware
 * 3. Defines API routes
 * 4. Serves static files
 * 5. Starts the server
 */

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: false }));  // Parse URL-encoded bodies

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Basic route to test API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to College Events API' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Set port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 