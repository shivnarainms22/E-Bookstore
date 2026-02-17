import React, { useState } from 'react';
import { createBook } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const BookForm = () => {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    price: '',
    categoryId: '',
    imageUrl: '' 
  });

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBook(bookData.categoryId, bookData);
      toast.success('Book created successfully!');
    } catch (error) {
      if (error.message === 'Category not available') {
        toast.error('Enter a valid Category ID');
      } else {
        toast.error('Error creating book');
      }
    }
  };

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: ORIGINAL green color preserved and modern styling applied */}
        <button
          onClick={() => navigate('/admin/dashboard')} 
          className="absolute top-4 left-4 bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} />
        </button>

        {/* Title: High-contrast white */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">Create Book</h2>
        </div>
        
        {/* Form content styled for the dark card */}
        <form onSubmit={handleSubmit}>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Title</label>
            <input
              type="text"
              // Input field: Lighter dark color, green focus ring
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Author</label>
            <input
              type="text"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              value={bookData.author}
              onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Price</label>
            <input
              type="text"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              value={bookData.price}
              onChange={(e) => setBookData({ ...bookData, price: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Category ID</label>
            <input
              type="text"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              value={bookData.categoryId}
              onChange={(e) => setBookData({ ...bookData, categoryId: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Image URL</label>
            <input
              type="text"
              className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              value={bookData.imageUrl}
              onChange={(e) => setBookData({ ...bookData, imageUrl: e.target.value })}
              required
            />
          </div>
          
          <div className="text-center">
            {/* Submit Button: ORIGINAL green color preserved */}
            <button 
              type="submit" 
              className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full font-semibold"
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

export default BookForm;
