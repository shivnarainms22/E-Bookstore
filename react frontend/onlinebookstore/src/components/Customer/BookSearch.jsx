import React, { useState } from 'react';
import { searchBooks, addToCart } from '../../services/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const BookSearch = () => {
  const [title, setTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    try {
      setError('');
      const response = await searchBooks(title.trim());
      setBooks(response.data);
      if (response.data.length === 0) {
        toast.info('Book coming soon to bookstore');
      }
    } catch (error) {
      setError('Error searching books');
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID is missing. Please log in again.');
        return;
      }

      const cartData = { userId, bookId };

      if (!cartData.userId || !cartData.bookId) {
        toast.error('Invalid data. Please try again.');
        return;
      }

      const response = await addToCart(cartData);
      toast.success('Book added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  return (
    // Background: Lighter Dark Charcoal Gradient (Consistent with Admin)
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="container mx-auto w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: ORIGINAL blue color preserved and modern styling applied */}
        <button
          onClick={() => navigate('/customer/dashboard')} 
          className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} /> 
        </button>

        {/* Title: High-contrast white */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">Search Books</h2>
        </div>
        
        {/* Search Input Field */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            // Input field: Dark background, white text, modern focus ring (Blue)
            className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        {/* Action Buttons (Search and Go to Cart) */}
        <div className="flex justify-between mb-8">
          <button
            onClick={handleSearch}
            // ORIGINAL blue color preserved
            className="bg-blue-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Search
          </button>
          <Link
            to={`/customer/cart/${localStorage.getItem('userId')}`}
            // ORIGINAL indigo color preserved
            className="bg-indigo-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-indigo-600 transition duration-300 font-semibold"
          >
            Go to Cart
          </Link>
        </div>
        
        {error && <p className="text-red-500 mb-6">{error}</p>}
        
        {/* Book List: Redesigned for dark theme contrast */}
        <ul className="list-none w-full">
          {books.map((book) => (
            <li
              key={book.id}
              // List Item: Lighter card background for high contrast against the form card
              className="flex justify-between items-center bg-gray-700/70 rounded-xl shadow-xl p-4 mb-4 border border-gray-600 transition duration-300 hover:bg-gray-700"
            >
              <div className="flex items-center">
                <img src={book.imageUrl} alt={book.title} className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-500" />
                <div className="text-left">
                  <strong className="text-white text-lg block">{book.title}</strong> 
                  <span className="text-gray-300">{book.author}</span> 
                  <span className="text-green-400 font-semibold block">₹{book.price}</span>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(book.id)}
                // ORIGINAL green color preserved
                className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600 transition duration-300 font-semibold text-sm"
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
        <ToastContainer />
      </div>
    </div>
);
};

export default BookSearch;
