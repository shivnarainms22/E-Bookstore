import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token to extract user role
  const decodedToken = parseJwt(token);
  const userRole = decodedToken.role;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Check if token is expired
  if (decodedToken.exp < currentTime) {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('token');  // Remove the expired token
    localStorage.removeItem('userId'); // Clear user data
    localStorage.removeItem('role');
    return <Navigate to="/login" />;
  }

  // Check if the user's role is allowed
  if (allowedRoles.includes(userRole)) {
    return children;
  }

  return <Navigate to="/login" />;
};

// Helper function to decode JWT
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export default ProtectedRoute;


