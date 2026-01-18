import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { cartAPI } from '../api/allApi.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'user') {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setItems(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartAPI.addToCart({ productId: product.id, quantity });
      toast.success(`${product.name} added to cart!`);
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeCartItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.updateCartItem(itemId, { quantity });
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};