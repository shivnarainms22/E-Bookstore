import React, { useEffect, useState, useCallback } from 'react';
import { getBooks, addToCart, getCart } from '../../services/api'; // Import getCart
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSearch, FaShoppingCart, FaTruck, FaClipboardList } from 'react-icons/fa';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [cartCount, setCartCount] = useState(0); // 1. New state for cart count
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Function to fetch and update the cart count
  const fetchCartCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await getCart(userId);
      
      // Calculate the total number of items (total quantity) in the cart
      const totalQuantity = response.data.cartDTO.reduce(
        (total, item) => total + item.quantity, 0
      );
      setCartCount(totalQuantity);
    } catch (error) {
      // Fail silently or show a minor toast if the count is critical
    }
  }, [userId]); // Depends on userId

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        toast.error('Error fetching books');
      }
    };
    
    fetchBooks();
    fetchCartCount(); // 2. Fetch cart count when the component mounts
  }, [fetchCartCount]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
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
      
      fetchCartCount(); // 3. Refresh the cart count after adding an item

    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="flex space-x-6">
          <Link
            to="/customer/search"
            className="text-white hover:text-blue-400"
            title="Search Books"
          >
            <FaSearch size={24} />
          </Link>

          {/* 4. Cart Icon with Item Count */}
          <Link
            to={`/customer/cart/${userId}`}
            className="text-white hover:text-green-400 relative"
            title="View Cart"
          >
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-800">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link
            to="/customer/place-order"
            className="text-white hover:text-yellow-400"
            title="Place Order"
          >
            <FaTruck size={24} />
          </Link>
          <Link
            to={`/customer/orders/${userId}`}
            className="text-white hover:text-teal-400"
            title="View Orders"
          >
            <FaClipboardList size={24} />
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-400"
            title="Logout"
          >
            <FaSignOutAlt size={24} style={{ color: "red" }} />
          </button>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-24 h-32 object-cover mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-gray-700 font-semibold mt-2">₹{book.price}</p>
              <button
                onClick={() => handleAddToCart(book.id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;