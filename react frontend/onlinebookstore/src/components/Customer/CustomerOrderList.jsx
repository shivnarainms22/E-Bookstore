import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrdersByUser } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5'; 

const CustomerOrderList = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) {
          console.error('User ID is missing');
          toast.error('User ID is missing. Please log in again.');
          return;
        }

        const response = await getOrdersByUser(userId);
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders');
      }
    };
    fetchOrders();
  }, [userId]);

  const handleGoHome = () => {
    navigate('/customer/dashboard');
  };

  
  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: ORIGINAL teal color preserved and modern styling applied */}
        <button
          onClick={() => navigate('/customer/dashboard')} 
          className="absolute top-4 left-4 bg-teal-500 text-white p-3 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} /> 
        </button>

        {/* Title: High-contrast white */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">MY ORDERS</h2>
        </div>
        
        {orders.length === 0 ? (
          // Empty State: Styled for dark theme
          <div className="text-center py-8">
            <p className="text-xl text-gray-400 mb-6">You haven't placed any orders yet!</p>
            <button
              onClick={handleGoHome}
              // ORIGINAL blue color preserved and modern styling applied
              className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 text-lg"
            >
              Go to Home
            </button>
          </div>
        ) : (
          // Order Table: Styled for dark theme with clear, legible data
          <table className="table-auto w-full text-left">
            {/* Table Head: Slightly lighter dark gray for clear heading separation */}
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tl-xl">Order ID</th>
                <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tr-xl">Date</th>
              </tr>
            </thead>
            
            {/* Table Body: Zebra striping for easy reading on dark background */}
            <tbody>
              {orders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className={`transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'} hover:bg-gray-700`}
                >
                  <td className="px-4 py-3 text-gray-400">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-green-400">₹{order.amount}</td>
                  <td className="px-4 py-3">
                    {/* Status Badge: Using dynamic color for status visualization */}
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      order.orderStatus === 'Shipped' ? 'bg-teal-600 text-white' :
                      order.orderStatus === 'Delivered' ? 'bg-green-600 text-white' :
                      order.orderStatus === 'Processing' ? 'bg-yellow-600 text-gray-900' :
                      'bg-red-600 text-white'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
);
};

export default CustomerOrderList;
