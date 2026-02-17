import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    // Background: Dark Gray/Charcoal Gradient for the entire screen
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col justify-center items-center p-6 text-center">
      
      {/* Content is placed directly on the background, using text color for contrast */}
      <div className="container mx-auto p-8 max-w-xl">
        
        {/* Text colors are stark white or light gray for perfect contrast */}
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-wider">The Bookstore</h1>
        <p className="text-xl text-gray-300 mb-10">Your one-stop destination for all your reading needs.</p>
        
        <div className="flex justify-center space-x-6">
          {/* Login button: White text on Black background */}
          <Link to="/login" className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-xl hover:bg-gray-200 transition duration-300 transform hover:scale-105 border border-white">
            Login
          </Link>
          {/* Sign Up button: Transparent background with white border (Outline style) */}
          <Link to="/signup" className="bg-transparent text-white font-semibold py-3 px-8 rounded-full shadow-xl hover:bg-white/10 transition duration-300 transform hover:scale-105 border border-white">
            Sign Up
          </Link>
        </div>
      </div>
      
      {/* Footer text is light gray, centered at the bottom. */}
      <footer className="mt-20 text-gray-400 text-sm">
        <p>&copy; 2025 Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;