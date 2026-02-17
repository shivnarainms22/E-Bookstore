import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
// In Docker, nginx proxies /api requests, so empty string works
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication
export const login = (credentials) => api.post('/authenticate', credentials);
export const signup = (userData) => api.post('/sign-up', userData);

// Admin APIs
export const createCategory = (categoryData) => api.post('/api/admin/category', categoryData);
export const getAllCategories = () => api.get('/api/admin/categories');
export const createBook = async (categoryId, bookData) => {
  if (!await isCategoryValid(categoryId)) {
    throw new Error('Category not available');
  }
  return api.post(`/api/admin/book/${categoryId}`, bookData);
};
export const getAllBooks = () => api.get('/api/admin/books');
export const deleteBook = (bookId) => api.delete(`/api/admin/book/${bookId}`);
export const updateBook = (categoryId, bookId, bookData) => api.put(`/api/admin/${categoryId}/book/${bookId}`, bookData);
export const getAllOrders = () => api.get('/api/admin/orders');
export const deleteCategory = (categoryId) => api.delete(`/api/admin/category/${categoryId}`);

// Customer APIs
export const getBooks = () => api.get('/api/customer/books');
export const searchBooks = (title) => api.get(`/api/customer/book/search/${title}`);
export const addToCart = (cartData) => api.post('/api/customer/cart', cartData);
export const getCart = (userId) => api.get(`/api/customer/cart/${userId}`);
export const addMinusBook = (userId, bookId) => api.get(`/api/customer/cart/${userId}/deduct/${bookId}`);
export const addPlusBook = (userId, bookId) => api.get(`/api/customer/cart/${userId}/add/${bookId}`);
export const placeOrder = (orderData) => api.post('/api/customer/placeOrder', orderData);
export const getOrdersByUser = (userId) => api.get(`/api/customer/orders/${userId}`);
export const removeBookFromCart = (userId, bookId) => api.delete(`/api/customer/cart/${userId}/remove/${bookId}`);

export const isCategoryValid = async (categoryId) => {
  try {
    const response = await api.get(`/api/admin/categories`);
    const categories = response.data; // Assuming response.data is an array of category objects

    // Check if the provided categoryId exists in the fetched categories
    return categories.some(category => category.id === parseInt(categoryId));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return false;
  }
};

// Payment APIs
export const getStripeConfig = () => api.get('/api/payment/config');
export const createPaymentIntent = (paymentData) => api.post('/api/payment/create-payment-intent', paymentData);
export const confirmPayment = (paymentIntentId, orderId) => 
  api.post(`/api/payment/confirm?paymentIntentId=${paymentIntentId}&orderId=${orderId}`);
export const getPaymentStatus = (paymentIntentId) => api.get(`/api/payment/status/${paymentIntentId}`);


