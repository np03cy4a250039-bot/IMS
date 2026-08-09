import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api" });

// attach token automatically when present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('ims_token');
  if (token) config.headers = { ...(config.headers||{}), Authorization: `Bearer ${token}` };
  return config;
});

export default API;
