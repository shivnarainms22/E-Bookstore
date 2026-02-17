import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; 

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      
      navigate('/login');
    }
  };

  return (
    // Background: Dark Gray/Charcoal Gradient for the entire screen
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col p-6 justify-center items-center">
      
      {/* Central Container: Transparent, relying on text and padding */}
      <div className="container mx-auto p-8 relative max-w-4xl">
        
        {/* Logout Button: Sleek, high-contrast and prominent */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleLogout}
            // Logout button is white text on a subtle dark red for quick identification
            className="flex items-center gap-2 bg-red-700 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
          >
             {/* Note: FaSignOutAlt needs to be imported */}
            <FaSignOutAlt size={18}/> 
            Logout
          </button>
        </div>
        
        {/* Header: White and prominent */}
        <div className="text-center mb-12 mt-4">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">Bookstore Management Portal</h2>
          <p className="text-lg text-gray-300 mt-2">Greetings, Book Curator!</p>
        </div>
        
        {/* Navigation Grid: Redesigned for a clean, professional look */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dashboard Links: Keeping original colors but applying modern styling (shadow-2xl and rounded-xl) */}
          <Link to="/admin/category" className="bg-blue-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-blue-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            Manage Categories
          </Link>
          <Link to="/admin/book" className="bg-green-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-green-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            Manage Books
          </Link>
          <Link to="/admin/orders" className="bg-yellow-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-yellow-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            View Orders
          </Link>
          
          <Link to="/admin/categories" className="bg-blue-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-blue-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            View Categories
          </Link>
          <Link to="/admin/books" className="bg-green-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-green-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            View Books
          </Link>
          <Link to="/admin/update-book" className="bg-yellow-500 text-white py-5 px-4 rounded-xl shadow-2xl hover:bg-yellow-600 transition duration-300 font-semibold text-center text-xl hover:scale-[1.02]">
            Update Book Details
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
