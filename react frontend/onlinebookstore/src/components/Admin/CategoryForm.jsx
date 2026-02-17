import React, { useState } from 'react';
import { createCategory } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const CategoryForm = () => {
  const [category, setCategory] = useState({ name: '', description: '' });
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(category);
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Error creating category');
    }
  };

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: Styled to match the card, using the original blue color */}
        <button
          onClick={() => navigate('/admin/dashboard')} 
          className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} />
        </button>

        {/* Title: High-contrast white */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">New Category</h2>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Category Name</label>
            <input
              type="text"
              // Input field: Slightly lighter dark gray for better separation, blue focus ring
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Description</label>
            <input
              type="text"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              required
            />
          </div>
          
          <div className="text-center">
            {/* Submit Button: ORIGINAL color preserved */}
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CategoryForm;

























