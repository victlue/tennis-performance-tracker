// A small helper to manage axios requests & token
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5002/api'
});

// Attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
