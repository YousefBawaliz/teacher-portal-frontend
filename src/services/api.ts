import axios, { type AxiosInstance, AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  // Prevent axios from following redirects on its own
  maxRedirects: 0,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle redirect responses (status codes 301, 302, 307, 308)
    if (
      error.response?.status &&
      error.response.status >= 301 &&
      error.response.status <= 308 &&
      error.response?.headers?.location
    ) {
      const newUrl = error.response.headers.location;
      if (originalRequest) {
        // Make a new request to the redirect location
        return api({
          ...originalRequest,
          url: newUrl
        });
      }
    }
    
    if (error.response?.status === 401 && originalRequest) {
      // Handle token refresh here
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/api/auth/refresh`, {
            refresh_token: refreshToken
          }, {
            withCredentials: true
          });
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;