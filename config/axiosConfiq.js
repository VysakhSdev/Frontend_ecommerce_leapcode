import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_URL || "/api";


const axiosConfig = axios.create({
  baseURL,
});

axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




export default axiosConfig;