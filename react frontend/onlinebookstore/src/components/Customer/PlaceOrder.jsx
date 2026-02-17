import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { placeOrder, getCart, getStripeConfig, createPaymentIntent } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutForm from './CheckoutForm';

const PlaceOrder = () => {
  const [orderData, setOrderData] = useState({
    address: '',
    payment: '',
    orderDescription: '',
  });
  const [cart, setCart] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load Stripe configuration
  useEffect(() => {
    const loadStripeConfig = async () => {
      try {
        const response = await getStripeConfig();
        const stripe = loadStripe(response.data.publishableKey);
        setStripePromise(stripe);
      } catch (error) {
        toast.error('Error loading payment system');
      }
    };
    loadStripeConfig();
  }, []);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          return;
        }

        const response = await getCart(userId);
        setCart(response.data.cartDTO);
        setCartAmount(response.data.amount);
        setOrderId(response.data.id);
      } catch (error) {
        // Error fetching cart
      }
    };
    fetchCart();
  }, []);

  const handleCODSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      toast.info('Cart is empty!');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      await placeOrder({ ...orderData, userId, payment: 'Cash on Delivery' });
      toast.success('Order placed successfully!');
      setTimeout(() => navigate(`/customer/orders/${userId}`), 2000);
    } catch (error) {
      toast.error('Error placing order');
    }
  };

  const handleStripePayment = async () => {
    if (!orderData.address) {
      toast.error('Please enter your delivery address');
      return;
    }

    if (!cart || cart.length === 0) {
      toast.info('Cart is empty!');
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      
      // Create payment intent with address
      const paymentResponse = await createPaymentIntent({
        userId: parseInt(userId),
        orderId: orderId,
        amount: cartAmount,
        currency: 'inr',
        description: `Order for ${cart.length} book(s)`,
        address: orderData.address,
        orderDescription: orderData.orderDescription
      });

      if (paymentResponse.data.success) {
        setClientSecret(paymentResponse.data.clientSecret);
        setShowPaymentForm(true);
        
        // Update order with address info (keeping it as PENDING until payment succeeds)
        setOrderData(prev => ({ ...prev, payment: 'STRIPE' }));
      } else {
        toast.error(paymentResponse.data.message || 'Error creating payment');
      }
    } catch (error) {
      toast.error('Error initiating payment. Please try again.');
    }

    setIsLoading(false);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // Payment already confirmed by CheckoutForm - just navigate to orders
    const userId = localStorage.getItem('userId');
    setTimeout(() => navigate(`/customer/orders/${userId}`), 2000);
  };

  const handlePaymentError = (error) => {
    setShowPaymentForm(false);
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#374151',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#374151',
          border: '1px solid #4b5563',
        },
        '.Input:focus': {
          border: '2px solid #3b82f6',
          boxShadow: '0 0 0 1px #3b82f6',
        },
        '.Label': {
          color: '#d1d5db',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">
            {showPaymentForm ? 'Complete Payment' : 'Place Order'}
          </h2>
          {showPaymentForm && (
            <p className="text-gray-400 mt-2">Enter your card details to complete the purchase</p>
          )}
        </div>
        
        {!showPaymentForm ? (
          <form onSubmit={handleCODSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Delivery Address</label>
              <input
                type="text"
                className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                value={orderData.address}
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                placeholder="Enter your full address"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2 text-left">Additional Notes</label>
              <textarea
                className="appearance-none bg-gray-700 border border-gray-600 rounded-xl w-full py-3 px-4 text-white placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 min-h-[80px]"
                value={orderData.orderDescription}
                onChange={(e) => setOrderData({ ...orderData, orderDescription: e.target.value })}
                placeholder="Any special instructions?"
              />
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
              <div className="space-y-2">
                {cart && cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-300 text-sm">
                    <span>{item.bookTitle} x{item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-white font-bold">
                    <span>Total</span>
                    <span className="text-green-400">₹{cartAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-semibold mb-3 text-left">Payment Method</label>
              
              <div className="space-y-3">
                {/* Card Payment Option */}
                <button
                  type="button"
                  onClick={handleStripePayment}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-semibold block">Pay with Card</span>
                      <span className="text-gray-400 text-sm">Credit/Debit Card, UPI, Wallets</span>
                    </div>
                  </div>
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                {/* COD Option */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl hover:bg-gray-700 transition duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-semibold block">Cash on Delivery</span>
                      <span className="text-gray-400 text-sm">Pay when you receive</span>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 font-semibold"
              onClick={() => navigate('/customer/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </form>
        ) : (
          <div>
            {/* Back button */}
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to order details
            </button>

            {/* Delivery Address Display */}
            <div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300 font-semibold">Delivery Address</span>
              </div>
              <p className="text-white ml-7">{orderData.address}</p>
            </div>

            {/* Stripe Payment Form */}
            {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm 
                  orderId={orderId}
                  amount={cartAmount}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PlaceOrder;
