import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCart, addPlusBook, addMinusBook, removeBookFromCart } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { userId } = useParams();
  const [cart, setCart] = useState(null);
  const [removedItems, setRemovedItems] = useState([]);

  const updateCart = useCallback((data) => {
    const filteredCart = data.cartDTO.filter(item => !removedItems.includes(item.bookId));
    const totalAmount = filteredCart.reduce((total, item) => total + item.price, 0);
    setCart({ ...data, cartDTO: filteredCart, amount: totalAmount });
  }, [removedItems]); 

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          console.error('User ID is missing');
          toast.error('User ID is missing. Please log in again.');
          return;
        }

        const response = await getCart(userId);
        updateCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to fetch cart. Please try again.');
      }
    };
    fetchCart();
  }, [userId, updateCart]); // Added updateCart to the dependency array

  const handleAddPlus = async (bookId) => {
    try {
      if (!userId) {
        console.error('User ID is missing');
        toast.error('User ID is missing. Please log in again.');
        return;
      }

      const response = await addPlusBook(userId, bookId);
      updateCart(response.data);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const handleAddMinus = async (bookId) => {
    try {
      if (!userId) {
        console.error('User ID is missing');
        toast.error('User ID is missing. Please log in again.');
        return;
      }

      const response = await addMinusBook(userId, bookId);
      updateCart(response.data);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      if (!userId) {
        console.error('User ID is missing');
        toast.error('User ID is missing. Please log in again.');
        return;
      }

      await removeBookFromCart(userId, bookId);
      setRemovedItems([...removedItems, bookId]);

      const updatedCart = cart.cartDTO.filter(item => item.bookId !== bookId);
      const totalAmount = updatedCart.reduce((total, item) => total + item.price, 0);

      if (updatedCart.length === 0) {
        setCart(null);
        toast.info('Your cart is empty. Add some books!');
        return;
      }

      setCart({ ...cart, cartDTO: updatedCart, amount: totalAmount });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const handleCheckoutClick = () => {
    if (!cart || cart.cartDTO.length === 0) {
      toast.info('Your cart is empty!');
      return;
    }
  };

  if (!cart || cart.amount === 0) {
    
    return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-12 text-center border border-gray-600">
        
        {/* Title: High-contrast white */}
        <h2 className="text-4xl font-extrabold text-white tracking-wider mb-4">Your Cart is Empty</h2>
        
        {/* Message */}
        <p className="text-gray-400 text-lg mb-10">It looks like your shelves need stocking! Add some books to your cart.</p>
        
        {/* Action Button: ORIGINAL blue color preserved and modern styling applied */}
        <Link
          to="/customer/dashboard"
          className="bg-blue-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 font-semibold text-lg"
        >
          Start Browsing Books
        </Link>
      </div>
    </div>
);
  }

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">Your Cart</h2>
        </div>
        
        {/* Table: Styled for dark theme with clear, legible data */}
        <table className="table-auto w-full text-left">
          {/* Table Head: Slightly lighter dark gray for clear heading separation */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tl-xl">Book Title</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider text-center">Quantity</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tr-xl text-center">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body: Zebra striping for easy reading on dark background */}
          <tbody>
            {cart.cartDTO.map((item, index) => (
              <tr 
                key={item.id} 
                className={`transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'} hover:bg-gray-700`}
              >
                <td className="px-4 py-3 font-medium text-white">{item.bookTitle}</td>
                <td className="px-4 py-3 text-gray-300 text-center">{item.quantity}</td>
                <td className="px-4 py-3 font-medium text-green-400">₹{item.price}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleAddMinus(item.bookId)}
                    // ORIGINAL red color preserved, modern rounded-full style
                    className="bg-red-500 text-white py-1 px-3 rounded-full shadow-md hover:bg-red-600 transition duration-300 me-2"
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleAddPlus(item.bookId)}
                    // ORIGINAL green color preserved, modern rounded-full style
                    className="bg-green-500 text-white py-1 px-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.bookId)}
                    // ORIGINAL gray color preserved, modern rounded-full style
                    className="bg-gray-500 text-white py-1 px-3 rounded-full shadow-md hover:bg-gray-600 transition duration-300 ms-2"
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Total Amount Footer */}
        <h4 className="text-2xl font-bold text-white mt-6 text-right">
          Total Amount: <span className="text-green-400">₹{cart.amount}</span>
        </h4>

        {/* Checkout Button */}
        <div className="text-center mt-8">
          <Link
            to="/customer/place-order"
            onClick={handleCheckoutClick}
            // ORIGINAL blue color preserved, modern rounded-full style
            className={`bg-blue-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 font-semibold text-lg`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
);
};

export default Cart;







