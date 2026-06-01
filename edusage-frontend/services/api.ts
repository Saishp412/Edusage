import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 300000, // 5 minutes timeout for file uploads and processing
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for better error handling and token management
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error("Backend server is not running. Please start the backend server on port 5000.");
      error.message = "Backend server is not running. Please start the backend server and try again.";
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request timeout. Backend server may be slow or unresponsive.");
      if (error.config?.timeout >= 300000) {
        error.message = "File upload timed out. The file might be too large or the processing is taking too long. Try a smaller file or check backend logs.";
      } else {
        error.message = "Request timeout. Please try again.";
      }
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - Token expired or invalid.");
      
      // Clear the invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      error.message = "Session expired. Please log in again.";
      return Promise.reject(error);
    } else if (error.response?.status === 403) {
      console.error("Forbidden - Insufficient permissions.");
      error.message = "You don't have permission to perform this action.";
    } else if (error.response?.status === 500) {
      console.error("Server error. Please check the backend logs.");
      error.message = "Server error. Please try again later.";
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle logout
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    window.location.href = '/login';
  }
};

export default API;
