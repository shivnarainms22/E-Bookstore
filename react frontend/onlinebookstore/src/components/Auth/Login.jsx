import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      const token = response.data.jwtToken;

      localStorage.setItem('token', token);

      const decodedToken = parseJwt(token);
      const userRole = decodedToken.role?.toUpperCase(); 
      const userId = decodedToken.userId;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      localStorage.setItem('role', userRole);

 

      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard'); 
      } else if (userRole === 'USER') {
        navigate('/customer/dashboard'); 
      } else {
        toast.error('Unknown user role');
      }
    } catch (error) {
 
      toast.error('Invalid credentials');
    }
  };

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

  return (
    // Background: Dark Gray/Charcoal Gradient for the entire screen
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      
      {/* Content is placed directly on the dark background, with a container to control width */}
      <div className="w-full max-w-md p-8 text-center"> 
        
        {/* Title: High-contrast white */}
        <h2 className="text-4xl font-extrabold text-white mb-10 tracking-wider">Sign In</h2>
        
        {/* Form content (labels and inputs) is now styled for the dark theme */}
        <form onSubmit={handleLogin}>
          <div className="mb-6 text-left">
            <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              // Input field: Dark background, light text, minimal border, modern focus ring
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-300"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-8 text-left">
            <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              // Input field: Dark background, light text, minimal border, modern focus ring
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-300"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <div className="text-center">
            {/* Login Button: Sleek, high-contrast white button */}
            <button 
              type="submit" 
              className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-xl hover:bg-gray-200 transition duration-300 transform hover:scale-105 w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;




