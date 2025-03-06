import apiClient from "../utils/api_client";

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/api/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Login failed");
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post("/api/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Registration failed");
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.post("/api/verify", { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Email verification failed");
  }
};
