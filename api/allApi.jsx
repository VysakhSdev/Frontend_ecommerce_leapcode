import axiosConfig from '../config/axiosConfiq';

// Authentication Module
export const authAPI = {
  register: (data) => axiosConfig.post("/auth/register", data),
  login: (data) => axiosConfig.post("/auth/login", data),
  createAdmin: (data) => axiosConfig.post("/auth/create-admin", data),
  getMe: () => axiosConfig.get("/users/me"),
};

// Product Module
export const productAPI = {
  getAllProducts: () => axiosConfig.get("/products"),

  createProduct: (data) => {
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      return axiosConfig.post("/products", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axiosConfig.post("/products", data);
  },

  updateProduct: (id, data) => {
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      return axiosConfig.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axiosConfig.put(`/products/${id}`, data);
  },

  deleteProduct: (id) => axiosConfig.delete(`/products/${id}`),
};

// Cart Module
export const cartAPI = {
  getCart: (id) => axiosConfig.get(id ? `/cart/${id}` : '/cart'),

  getAllCarts: () => axiosConfig.get("/cart/all"),
  addToCart: (data) => axiosConfig.post("/cart/add", data),
  updateCartItem: (id, data) => axiosConfig.put(`/cart/${id}`, data),
  removeCartItem: (id) => axiosConfig.delete(`/cart/${id}`),
};

// Administrative Module
export const adminAPI = {
  getAllUsers: () => axiosConfig.get("/users/all"),
  getAllCustomers: () => axiosConfig.get("/users/customers"),
};


