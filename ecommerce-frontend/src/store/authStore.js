import { create } from 'zustand';
import api from '../services/api';

console.log('[AuthStore] Inicializando store de autenticación');

const useAuthStore = create((set) => ({
  // Estado inicial
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Función para limpiar errores
  clearError: () => {
    set({ error: null });
  },

  // Acciones
  login: async (email, password) => {
    set({ isLoading: true, error: null });
     
    try {
      console.log('[AuthStore] Iniciando login', email, password);
      const response =  await api.post('/usuarios/login', { email, password });
      const { data } = response;

      
      
      if (data?.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        
        set({
          user: data.data.usuario,
          token: data.data.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
    } catch (error) {
      console.error('Error durante login:', error);
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    
    
    const token = localStorage.getItem('token');
    if (!token) {
     
      set({ isAuthenticated: false, user: null });
      return false;
    }
    
    
    set({ isLoading: true });
    
    try {
      // Verificar si el token es válido haciendo una petición al backend
       
      const response = await api.get('/usuarios/datos/perfil');
       
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch {
       
      
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return false;
    }
  }
}));

export default useAuthStore;
