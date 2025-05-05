import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protected Route Component
 * 
 * This component protects routes that should only be accessible to authenticated users.
 * If the user is not logged in, they will be redirected to the login page.
 * If the user is logged in, the nested routes (child components) will be rendered.
 */
function ProtectedRoute() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in, render the child routes
  return <Outlet />;
}

export default ProtectedRoute; 