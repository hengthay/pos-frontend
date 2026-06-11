import axios from "axios";
import Swal from "sweetalert2";
import { isTokenExpired } from "./helper/tokenExpiredChecker";

const API = `${import.meta.env.VITE_BASE_URL}`;

const API_BASE_URL = `${API}/api`;

const axiosInstace = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': "application/json",
    "Content-type": "application/json"
  }
});

// Check every request API
axiosInstace.interceptors.request.use((config) => {
  // Get token from user
  const userData = localStorage.getItem("userData");
  const parsed = userData ? JSON.parse(userData) : null;
  const token = parsed?.access_token;

  // If token present and it expired
  if(token && isTokenExpired(token)) {
    localStorage.removeItem("userData"); // Remove localStorage
    showSessionExpiredPopup();
    return Promise.reject(new Error('Token expired!'));
  }

  // if token exists and valid
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - catch 401 errors
axiosInstace.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401) {
      // Token might have expired on server side
      localStorage.removeItem("userData");
      showSessionExpiredPopup();
    }
    return Promise.reject(error);
  }
);

// Pop up session expired function
const showSessionExpiredPopup = () => {
  Swal.fire({
    title: 'Session Expired',
    text: 'Your session has expired. Please log in again to continue.',
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: '#007bff',
    backdrop: `rgba(0,0,123,0.4)`,
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      import("../app/store").then(({ default: store }) => {
        import("../feature/auth/authSlice").then(({ forceLogout }) => {
          // Force logout
          store.dispatch(forceLogout());
          // Redirect to login page
          window.location.href = '/login';
        });
      });
    }
  });
};

export { API_BASE_URL, axiosInstace };