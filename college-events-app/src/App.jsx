import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventForm from './pages/EventForm';
import LocalStorageTest from './LocalStorageTest';

/**
 * Main App Component
 * 
 * This component sets up the routing for the application, including:
 * - Public routes (login, register)
 * - Protected routes that require authentication (events, add/edit event)
 */
function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation bar shown on all pages */}
        <Navbar />
        
        {/* Main content area */}
        <main>
          <Routes>
            {/* Public routes - accessible to everyone */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/storage-test" element={<LocalStorageTest />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/events" element={<EventList />} />
              <Route path="/add-event" element={<EventForm />} />
              <Route path="/edit-event/:id" element={<EventForm />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
