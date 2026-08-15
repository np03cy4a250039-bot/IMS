import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''
const API = API_BASE ? `${API_BASE}/api` : '/api'

const client = axios.create({
  baseURL: API,
  withCredentials: true,
})

export const api = {
  getProducts: (params) => client.get('/products', { params }),
  getProduct: (id) => client.get(`/products/${id}`),
  createProduct: (data) => client.post('/products', data),
  updateProduct: (id, data) => client.put(`/products/${id}`, data),
  deleteProduct: (id) => client.delete(`/products/${id}`),

  getSuppliers: () => client.get('/suppliers'),
  getSupplier: (id) => client.get(`/suppliers/${id}`),
  createSupplier: (data) => client.post('/suppliers', data),
  updateSupplier: (id, data) => client.put(`/suppliers/${id}`, data),
  deleteSupplier: (id) => client.delete(`/suppliers/${id}`),

  login: (username, password) => client.post('/auth/login', { username, password }),
  register: (username, password, registerSecret) => client.post('/auth/register', { username, password, registerSecret }),
  logout: () => client.post('/auth/logout'),
  me: () => client.get('/auth/me'),
}

export default client