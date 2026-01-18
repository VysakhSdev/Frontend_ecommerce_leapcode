import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/allApi.jsx';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    return {
      user,
      token,
      isAuthenticated: !!token && !!user,
      loading: !!token, 
    };
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, isAuthenticated: false, loading: false });
  }, []);

  const login = useCallback((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, loading: false });
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const storedUser = userString ? JSON.parse(userString) : null;

    if (!token || !storedUser) {
      logout();
      return;
    }

    try {
      const response = await authAPI.getMe();
      const freshUser = response.data;
      localStorage.setItem('user', JSON.stringify(freshUser));
      setState({ user: freshUser, token, isAuthenticated: true, loading: false });
    } catch (err) {
      console.error("Session verification failed", err);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, []); // Only run once on mount (refresh)

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};