import axios from 'axios';

const API_BASE_URL = 'http://localhost:8008/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (keyword, params) => api.get('/products/search', { params: { keyword, ...params } }),
  getByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  getStock: (id) => api.get(`/products/stock/${id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
  getCount: () => api.get('/cart/count'),
};

// Wishlist APIs
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/products/${productId}`),
  remove: (productId) => api.delete(`/wishlist/products/${productId}`),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
  getCount: () => api.get('/wishlist/count'),
  clear: () => api.delete('/wishlist'),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getItems: (id) => api.get(`/orders/${id}/items`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getCount: () => api.get('/orders/count'),
};

// Profile APIs
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  getAddresses: () => api.get('/profile/addresses'),
  addAddress: (data) => api.post('/profile/addresses', data),
  updateAddress: (id, data) => api.put(`/profile/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/profile/addresses/${id}`),
  getDefaultAddress: () => api.get('/profile/addresses/default'),
};

export default api;