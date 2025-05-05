import { useState, useEffect } from 'react';

function LocalStorageTest() {
  const [events, setEvents] = useState([]);
  const [testId, setTestId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get events from localStorage
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const handleDelete = () => {
    if (!testId) {
      setMessage('Please enter an ID to delete');
      return;
    }

    // Get current events
    const currentEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Filter out the event with the specified ID
    const filteredEvents = currentEvents.filter(e => e.id !== testId);
    
    if (filteredEvents.length === currentEvents.length) {
      setMessage(`Event with ID ${testId} not found`);
      return;
    }
    
    // Save filtered events back to localStorage
    localStorage.setItem('events', JSON.stringify(filteredEvents));
    
    // Update state
    setEvents(filteredEvents);
    setMessage(`Event with ID ${testId} was deleted`);
  };

  const resetStorage = () => {
    // Re-initialize the events in localStorage with default data
    localStorage.removeItem('events');
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h2>LocalStorage Test</h2>
      
      <div className="mb-3">
        <label className="form-label">Event ID to Delete:</label>
        <input 
          type="text" 
          className="form-control" 
          value={testId} 
          onChange={(e) => setTestId(e.target.value)}
        />
      </div>
      
      <div className="mb-3">
        <button className="btn btn-danger me-2" onClick={handleDelete}>
          Delete Event
        </button>
        <button className="btn btn-warning" onClick={resetStorage}>
          Reset Storage
        </button>
      </div>
      
      {message && <div className="alert alert-info">{message}</div>}
      
      <h4>Current Events in localStorage:</h4>
      <pre className="border p-3 bg-light">
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  );
}

export default LocalStorageTest; 