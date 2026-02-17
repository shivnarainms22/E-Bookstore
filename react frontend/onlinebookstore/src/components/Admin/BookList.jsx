import React, { useEffect, useState } from 'react';
import { getAllBooks, deleteBook } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Error fetching books');
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this book?')) {
        return;
      }
      await deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book');
    }
  };

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
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
          <h2 className="text-4xl font-extrabold text-white tracking-wider">BOOK INVENTORY</h2>
        </div>
        
        {/* Table: Styled for dark theme with clear, legible data */}
        <table className="table-auto w-full text-left">
          {/* Table Head: Slightly lighter dark gray for clear heading separation */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tl-xl">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body: Zebra striping for easy reading on dark background */}
          <tbody>
            {books.map((book, index) => (
              <tr 
                key={book.id} 
                // Alternating rows using different dark shades for "zebra" effect
                className={`transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'} hover:bg-gray-700`}
              >
                <td className="px-4 py-3 text-gray-400">{book.id}</td>
                <td className="px-4 py-3">
                  <img src={book.imageUrl} alt={book.title} className="w-16 h-16 object-cover rounded-md shadow-lg border border-gray-700" />
                </td>
                <td className="px-4 py-3 font-medium text-white">{book.title}</td>
                <td className="px-4 py-3 text-gray-300">{book.author}</td>
                <td className="px-4 py-3 font-medium text-green-400">₹{book.price}</td>
                <td className="px-4 py-3 text-gray-300">{book.categoryName}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(book.id)}
                    // Delete button: ORIGINAL red color preserved
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookList;
