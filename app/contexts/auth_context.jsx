"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import * as authService from "../services/auth_service";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  token: null,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  verifyEmail: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  });

  const [role, setRole] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("role") : null;
  });

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      // Simpan token dan role di localStorage
      const userToken = response.token;
      const userRole = response.role; // Pastikan API mengembalikan role

      localStorage.setItem("token", userToken);
      localStorage.setItem("role", userRole);

      setToken(userToken);
      setRole(userRole);

      router.push("/home");

      return response;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);

    router.push("/");
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      router.push("/login");
      return response;
    } catch (error) {
      console.error("Email verification failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, register, logout, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
