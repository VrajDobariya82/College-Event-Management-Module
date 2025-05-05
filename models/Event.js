const mongoose = require('mongoose');

/**
 * Event Schema
 * 
 * Defines the structure for events in the database.
 * Includes all the necessary fields for college events.
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide event type'],
    enum: ['Cultural', 'Technical', 'Sports', 'Academic', 'Other']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema); 