import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function EventList() {
  // State for events, search functionality, and modal
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load events using apiService
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { events: fetchedEvents } = await apiService.getEvents();
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError('Failed to load events: ' + err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Functions to handle user actions
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await apiService.deleteEvent(id);
        // Refresh the events list after successful deletion
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event: ' + err.message);
        console.error('Error deleting event:', err);
        setLoading(false);
      }
    }
  };

  const showEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mt-4">
      {/* Header with title and add button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>College Events</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/add-event')}
        >
          Add New Event
        </button>
      </div>
      
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search events by title or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error and loading messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}

      {/* Events grid */}
      <div className="row">
        {!loading && filteredEvents.map(event => (
          <div key={event.id} className="col-md-4 mb-4">
            <div className="card h-100">
              {/* Event image */}
              <img src={event.imageUrl} className="card-img-top" alt={event.title} />
              
              {/* Event details */}
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">
                  <span className="badge bg-primary me-2">{event.type}</span>
                  <small className="text-muted">{event.date}</small>
                </p>
                
                {/* Action buttons */}
                <div className="btn-group">
                  <button 
                    className="btn btn-info btn-sm" 
                    onClick={() => showEventDetails(event)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-warning btn-sm" 
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for event details */}
      {selectedEvent && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button type="button" className="btn-close" onClick={closeEventDetails}></button>
              </div>
              <div className="modal-body">
                <img src={selectedEvent.imageUrl} className="img-fluid mb-3" alt={selectedEvent.title} />
                <p><strong>Type:</strong> {selectedEvent.type}</p>
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Description:</strong> {selectedEvent.description}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEventDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}

      {/* Show message if no events found */}
      {!loading && filteredEvents.length === 0 && (
        <div className="alert alert-info">No events found.</div>
      )}
    </div>
  );
}

export default EventList; 