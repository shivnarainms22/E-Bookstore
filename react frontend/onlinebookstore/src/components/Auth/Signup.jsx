import React, { useState } from 'react';
import { signup } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Error during signup');
      }
    }
  };

 
  return (
    // Background: Dark Gray/Charcoal Gradient for the entire screen
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      
      {/* Content is placed directly on the dark background, with a container to control width */}
      <div className="w-full max-w-md p-8 text-center"> 
        
        {/* Title: High-contrast white, larger, and bold */}
        <h2 className="text-4xl font-extrabold text-white mb-10 tracking-wider">Create Account</h2>
        
        {/* Form content (labels and inputs) is now styled for the dark theme */}
        <form onSubmit={handleSignup}>
          <div className="mb-6 text-left">
            <label className="block text-gray-300 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              // Input field: Dark background, light text, minimal border, modern focus ring
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-300"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-6 text-left">
            <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-300"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-8 text-left">
            <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-300"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
          </div>
          <div className="text-center">
            {/* Sign Up Button: Sleek, high-contrast white button */}
            <button 
              type="submit" 
              className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-xl hover:bg-gray-200 transition duration-300 transform hover:scale-105 w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;


