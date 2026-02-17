import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (error) {
        toast.error('Error fetching orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: ORIGINAL yellow color preserved and modern styling applied */}
        <button
          onClick={() => navigate('/admin/dashboard')} 
          className="absolute top-4 left-4 bg-yellow-500 text-white p-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} /> 
        </button>

        {/* Title: High-contrast white */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">CUSTOMER ORDERS</h2>
        </div>
        
        {/* Table: Styled for dark theme with clear, legible data */}
        <table className="table-auto w-full text-left">
          {/* Table Head: Slightly lighter dark gray for clear heading separation */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tl-xl">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">User</th>
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
                // Alternating rows using different dark shades for "zebra" effect
                className={`transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'} hover:bg-gray-700`}
              >
                <td className="px-4 py-3 text-gray-400">{order.id}</td>
                <td className="px-4 py-3 font-medium text-white">{order.username}</td>
                {/* Highlight amount in a contrast color (yellow/amber) */}
                <td className="px-4 py-3 font-medium text-amber-400">₹{order.amount}</td>
                {/* Apply dynamic color based on order status for quick visual scan */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    order.orderStatus === 'Shipped' ? 'bg-teal-600 text-white' :
                    order.orderStatus === 'Delivered' ? 'bg-green-600 text-white' :
                    order.orderStatus === 'Processing' ? 'bg-yellow-600 text-gray-900' :
                    'bg-red-600 text-white'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(order.date).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminOrderList;
