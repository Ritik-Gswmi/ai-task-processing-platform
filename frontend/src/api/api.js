import axios from "axios";
import { clearCurrentTask, getToken, removeToken } from "../utils/token";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api"),
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/* GLOBAL ERROR HANDLER */

API.interceptors.response.use(
  (response) => response,
  (error) => {

    console.log("API Error Status:", error.response?.status);
    console.log("API Error Message:", error.response?.data?.message);

    // Auto logout if token expired
    if (error.response?.status === 401) {
      removeToken();
      clearCurrentTask();
    }

    return Promise.reject(error);
  }
);

export default API;
