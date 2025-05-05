import { Link, useNavigate } from 'react-router-dom';

/**
 * Navigation Bar Component
 * 
 * This component handles the top navigation bar and changes its appearance
 * based on whether the user is logged in or not.
 */
function Navbar() {
  const navigate = useNavigate();
  
  // Get user information from localStorage (if logged in)
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand/logo */}
        <Link className="navbar-brand" to="/">College Event Management</Link>
        
        {/* Mobile toggle button */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Show these links if user is logged in */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">Events</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-event">Create Event</Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-light">Welcome, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              /* Show these links if user is not logged in */
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 