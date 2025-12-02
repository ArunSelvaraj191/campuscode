import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create Axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("Access Forbidden:", data.error);
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error("Resource not found:", data.error);
      }

      // Handle 500 Server Error
      if (status >= 500) {
        console.error("Server error:", data.error);
      }

      return Promise.reject({
        status,
        message: data.error || data.message || "An error occurred",
        data,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        status: 0,
        message: "No response from server. Check your connection.",
        data: null,
      });
    } else {
      // Error in request setup
      return Promise.reject({
        status: 0,
        message: error.message || "An error occurred",
        data: null,
      });
    }
  }
);

export default axiosInstance;
