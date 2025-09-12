import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
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

export default API;
