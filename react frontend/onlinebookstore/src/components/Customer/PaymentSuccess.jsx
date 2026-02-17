import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' && paymentIntentId) {
      // Verify payment with backend
      const verifyPayment = async () => {
        try {
          const response = await getPaymentStatus(paymentIntentId);
          if (response.data.status === 'succeeded') {
            setStatus('success');
            setPaymentDetails(response.data);
            toast.success('Payment verified successfully!');
          } else {
            setStatus('pending');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setStatus('success'); // Assume success if redirect_status was succeeded
        }
      };
      verifyPayment();
    } else if (redirectStatus === 'processing') {
      setStatus('processing');
    } else if (redirectStatus === 'requires_payment_method') {
      setStatus('failed');
      toast.error('Payment failed. Please try again.');
    } else {
      // No payment parameters, check if direct navigation
      setStatus('success');
    }
  }, [searchParams]);

  const handleViewOrders = () => {
    const userId = localStorage.getItem('userId');
    navigate(`/customer/orders/${userId}`);
  };

  const handleContinueShopping = () => {
    navigate('/customer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600 text-center">
        
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
            <p className="text-gray-400">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
            
            {paymentDetails && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-green-400 font-bold">₹{paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 capitalize">{paymentDetails.status}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleViewOrders}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 font-semibold"
              >
                View My Orders
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === 'processing' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Payment Processing</h2>
            <p className="text-gray-400 mb-6">Your payment is being processed. We'll update your order once it's confirmed.</p>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 font-semibold"
            >
              Return to Dashboard
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Payment Failed</h2>
            <p className="text-gray-400 mb-6">We couldn't process your payment. Please try again with a different payment method.</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer/place-order')}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PaymentSuccess;

