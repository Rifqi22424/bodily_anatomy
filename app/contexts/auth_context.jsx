"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/auth_service';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  verifyEmail: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on initial load
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      router.push('/dashboard');
      
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      router.push('/login');
      return response;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      router.push('/login');
      return response;
    } catch (error) {
      console.error('Email verification failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);