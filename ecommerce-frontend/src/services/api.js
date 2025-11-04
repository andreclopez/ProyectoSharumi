import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar respuestas
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición API:', error);
    return Promise.reject(error);
  }
);

// Interceptor para agregar token
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default API;
