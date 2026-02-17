import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { confirmPayment } from '../../services/api';
import { toast } from 'react-toastify';

const CheckoutForm = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/customer/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message);
          toast.error(error.message);
        } else {
          setMessage('An unexpected error occurred.');
          toast.error('An unexpected error occurred.');
        }
        if (onPaymentError) {
          onPaymentError(error);
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful - confirm with backend
        try {
          await confirmPayment(paymentIntent.id, orderId);
          setMessage('Payment successful!');
          toast.success('Payment successful! Your order has been placed.');
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentIntent);
          }
        } catch (backendError) {
          console.error('Error confirming payment with backend:', backendError);
          toast.error('Payment successful but order update failed. Please contact support.');
        }
      } else if (paymentIntent) {
        setMessage(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('An error occurred during payment processing.');
      toast.error('An error occurred during payment processing.');
      if (onPaymentError) {
        onPaymentError(err);
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.includes('successful') 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 p-4 bg-gray-700/50 rounded-xl">
        <span className="text-gray-300 font-semibold">Total Amount:</span>
        <span className="text-2xl font-bold text-green-400">₹{amount}</span>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-4 px-6 rounded-full font-bold text-lg transition duration-300 shadow-lg ${
          isProcessing || !stripe || !elements
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      <div className="mt-4 flex items-center justify-center text-gray-400 text-sm">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secured by Stripe
      </div>
    </form>
  );
};

export default CheckoutForm;

