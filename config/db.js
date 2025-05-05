const mongoose = require('mongoose');
require('dotenv').config();

/**
 * MongoDB Connection
 * 
 * This file handles connecting to the MongoDB database.
 * The connection string is read from environment variables.
 */

// Get MongoDB URI from environment variables or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_events_123456';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 