const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

/**
 * Events Controller
 * 
 * Handles CRUD operations for college events.
 */

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    // Get all events and sort by date (most recent first)
    const events = await Event.find()
      .sort({ date: -1 })
      .populate('user', 'name');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id).populate('user', 'name');
    
    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.user = req.user._id;
    
    // Handle file upload if there is a file
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Create event
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    // Find event by ID
    let event = await Event.findById(req.params.id);
    
    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is the event owner
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }
    
    // Handle file upload if there is a file
    if (req.file) {
      // Delete old image if exists
      if (event.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', event.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Add new image path
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    // Find event by ID
    const event = await Event.findById(req.params.id);
    
    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is the event owner
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }
    
    // Delete image file if exists
    if (event.imageUrl) {
      const imagePath = path.join(__dirname, '..', event.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete event - Using findByIdAndDelete instead of deleteOne for better consistency
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
}; 