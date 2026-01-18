import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import { Toaster } from 'react-hot-toast';

// Define roles strictly as per requirement
const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user'
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Cart: User Specific Requirement */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={[ROLES.USER]}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Product Management: Both Admin and SuperAdmin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Management & Admin Creation: SuperAdmin only */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nexus E Commerce.
          </div>
        </footer>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;