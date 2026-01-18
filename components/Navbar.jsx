
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart, LogOut, Menu, X, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  console.log('User in Navbar:', user);
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Nexus
              </span>
            </Link>

          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    {items.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium">
                  {user?.role === 'user' ? <User className="w-4 h-4 mr-2" /> : <Shield className="w-4 h-4 mr-2 text-indigo-600" />}
                  {user?.name||user?.data?.name}
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
