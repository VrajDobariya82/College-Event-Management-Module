import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/api';

function EventForm() {
  // Get URL parameters and navigation functions
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'Cultural',
    description: '',
    location: '',
    image: null
  });
  
  // UI states
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Load existing event data if in edit mode
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const { event } = await apiService.getEvent(id);
        
        setFormData({
          title: event.title,
          date: event.date,
          type: event.type,
          description: event.description,
          location: event.location
        });
        
        setImagePreview(event.imageUrl);
        setError('');
      } catch (err) {
        setError('Failed to load event: ' + err.message);
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, isEditMode]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview of the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file
      });
      setImagePreview(imageUrl);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.date || !formData.type || !formData.location || !formData.description) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await apiService.updateEvent(id, formData);
      } else {
        await apiService.createEvent(formData);
      }
      
      // Redirect back to events list
      navigate('/events');
    } catch (err) {
      setError('Failed to save event: ' + err.message);
      console.error('Error saving event:', err);
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      {/* Page title */}
      <h2>{isEditMode ? 'Edit Event' : 'Add New Event'}</h2>
      
      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Loading indicator */}
      {loading && <div className="text-center my-3"><div className="spinner-border" role="status"></div></div>}
      
      {/* Event form */}
      <form onSubmit={handleSubmit}>
        {/* Event title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Event Title*</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        {/* Event date */}
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Event Date*</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        {/* Event type */}
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Event Type*</label>
          <select
            className="form-select"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Sports">Sports</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Event location */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location*</label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        {/* Event description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description*</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            required
          ></textarea>
        </div>
        
        {/* Event image */}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Event Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {/* Image preview */}
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Event Preview" 
                className="img-thumbnail" 
                style={{ maxHeight: '200px' }} 
              />
            </div>
          )}
        </div>
        
        {/* Form buttons */}
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {isEditMode ? 'Update Event' : 'Create Event'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/events')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm; 