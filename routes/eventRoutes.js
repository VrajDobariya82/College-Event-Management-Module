const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * Event Routes
 * 
 * Routes for event CRUD operations.
 * All routes are protected and require authentication.
 */
const router = express.Router();

// Get all events and create new event
router
  .route('/')
  .get(protect, getEvents)
  .post(protect, upload.single('image'), createEvent);

// Get, update and delete specific event
router
  .route('/:id')
  .get(protect, getEvent)
  .put(protect, upload.single('image'), updateEvent)
  .delete(protect, deleteEvent);

module.exports = router; 