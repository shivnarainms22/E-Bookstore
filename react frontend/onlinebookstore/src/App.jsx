import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CategoryForm from './components/Admin/CategoryForm';
import BookForm from './components/Admin/BookForm';
import AdminOrderList from './components/Admin/AdminOrderList';
import CategoryList from './components/Admin/CategoryList'; 
import BookList from './components/Admin/BookList'; 
import UpdateBook from './components/Admin/UpdateBook'; 
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/Customer/UserDashboard';
import BookSearch from './components/Customer/BookSearch';
import Cart from './components/Customer/Cart';
import PlaceOrder from './components/Customer/PlaceOrder';
import CustomerOrderList from './components/Customer/CustomerOrderList';
import PaymentSuccess from './components/Customer/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/book"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <BookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminOrderList />
            </ProtectedRoute>
          }
        />

        {/* Protected Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/search"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <BookSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/cart/:userId"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/place-order"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/:userId"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <CustomerOrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/payment-success"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/categories"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <CategoryList />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/books"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <BookList />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/update-book"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <UpdateBook />
    </ProtectedRoute>
  }
/>

        {/* Fallback Route */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;