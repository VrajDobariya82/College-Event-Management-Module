import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models
const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

const Event = mongoose.model('Event', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Cultural', 'Technical', 'Sports', 'Academic', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://source.unsplash.com/random/300x200/?event'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

// Connect to MongoDB
const connectDB = async () => {
  try {
    // MongoDB connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-events';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// User Routes

// Register a new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // In production, this should be hashed
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password (in production, this would use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Event Routes

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create event
app.post('/api/events', async (req, res) => {
  try {
    const { title, date, type, description, location, imageUrl, userId } = req.body;

    const event = new Event({
      title,
      date,
      type,
      description,
      location,
      imageUrl: imageUrl || `https://source.unsplash.com/random/300x200/?${type.toLowerCase()}`,
      createdBy: userId
    });

    await event.save();

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { title, date, type, description, location, imageUrl } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.title = title;
    event.date = date;
    event.type = type;
    event.description = description;
    event.location = location;
    if (imageUrl) {
      event.imageUrl = imageUrl;
    }

    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 