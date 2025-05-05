/**
 * API Service
 * 
 * This file handles all data operations using localStorage instead of
 * making real API calls to a backend server
 */

// Helper to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Initialize localStorage with some sample data if it doesn't exist
const initializeLocalStorage = () => {
  if (!localStorage.getItem('events')) {
    const sampleEvents = [
      {
        id: '1',
        title: 'Annual Tech Symposium',
        date: '2023-11-15',
        type: 'Technical',
        description: 'A gathering of tech enthusiasts showcasing the latest innovations.',
        location: 'Main Auditorium',
        imageUrl: 'https://source.unsplash.com/random/300x200/?tech',
        createdBy: '1',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Cultural Night',
        date: '2023-12-10',
        type: 'Cultural',
        description: 'Celebrate diversity with performances from various cultures.',
        location: 'College Grounds',
        imageUrl: 'https://source.unsplash.com/random/300x200/?culture',
        createdBy: '1',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Sports Day',
        date: '2023-10-25',
        type: 'Sports',
        description: 'Annual sports competition featuring various games and athletics.',
        location: 'Sports Complex',
        imageUrl: 'https://source.unsplash.com/random/300x200/?sports',
        createdBy: '1',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('events', JSON.stringify(sampleEvents));
  }
  
  if (!localStorage.getItem('users')) {
    const sampleUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
};

// Initialize localStorage when the app loads
initializeLocalStorage();

// API service methods for frontend components to use
const apiService = {
  // Authentication endpoints
  login: async (credentials) => {
    await simulateApiDelay();
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store user info in localStorage for "session" management
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { user: userInfo };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    await simulateApiDelay();
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store user info in localStorage for "session" management
      const userInfo = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { user: userInfo };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    await simulateApiDelay();
    
    const userInfo = localStorage.getItem('user');
    
    if (!userInfo) {
      throw new Error('Not authenticated');
    }
    
    return { user: JSON.parse(userInfo) };
  },
  
  // Event management endpoints
  getEvents: async () => {
    await simulateApiDelay();
    
    try {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      return { events };
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },
  
  getEvent: async (id) => {
    await simulateApiDelay();
    
    try {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const event = events.find(e => e.id === id);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      return { event };
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  },
  
  createEvent: async (eventData) => {
    await simulateApiDelay();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      
      // Generate image URL
      let imageUrl = 'https://source.unsplash.com/random/300x200/?event';
      
      // Use the actual uploaded image file
      if (eventData.image instanceof File) {
        try {
          // Check file size - limit to 5MB
          if (eventData.image.size > 5 * 1024 * 1024) {
            throw new Error('Image file is too large (max 5MB)');
          }
          
          // Convert the image file to a data URL
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(eventData.image);
          });
          
          // Test localStorage capacity
          try {
            const testKey = 'test_storage_' + Date.now();
            localStorage.setItem(testKey, imageUrl);
            localStorage.removeItem(testKey);
          } catch (e) {
            throw new Error('Not enough storage space for this image');
          }
        } catch (imageError) {
          console.error('Image processing error:', imageError);
          throw imageError;
        }
      }
      
      // Create new event
      const newEvent = {
        id: String(Date.now()),
        title: eventData.title,
        date: eventData.date,
        type: eventData.type,
        description: eventData.description,
        location: eventData.location,
        imageUrl: imageUrl,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      };
      
      // Add to events array
      events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(events));
      
      return { event: newEvent };
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },
  
  updateEvent: async (id, eventData) => {
    await simulateApiDelay();
    
    try {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const eventIndex = events.findIndex(e => e.id === id);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      // Handle image URL
      let imageUrl = events[eventIndex].imageUrl;
      
      // Use the actual uploaded image file
      if (eventData.image instanceof File) {
        try {
          // Check file size - limit to 5MB
          if (eventData.image.size > 5 * 1024 * 1024) {
            throw new Error('Image file is too large (max 5MB)');
          }
          
          // Convert the image file to a data URL
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(eventData.image);
          });
          
          // Test localStorage capacity
          try {
            const testKey = 'test_storage_' + Date.now();
            localStorage.setItem(testKey, imageUrl);
            localStorage.removeItem(testKey);
          } catch (e) {
            throw new Error('Not enough storage space for this image');
          }
        } catch (imageError) {
          console.error('Image processing error:', imageError);
          throw imageError;
        }
      }
      
      // Update event
      events[eventIndex] = {
        ...events[eventIndex],
        title: eventData.title,
        date: eventData.date,
        type: eventData.type,
        description: eventData.description,
        location: eventData.location,
        imageUrl: imageUrl
      };
      
      localStorage.setItem('events', JSON.stringify(events));
      
      return { event: events[eventIndex] };
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  },
  
  deleteEvent: async (id) => {
    await simulateApiDelay();
    
    try {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const filteredEvents = events.filter(e => e.id !== id);
      
      if (filteredEvents.length === events.length) {
        throw new Error('Event not found');
      }
      
      localStorage.setItem('events', JSON.stringify(filteredEvents));
      
      return { message: 'Event deleted successfully' };
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
};

export default apiService; 