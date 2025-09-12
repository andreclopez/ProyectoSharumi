import API from "./api";

/**
 * Servicio para gestionar las operaciones relacionadas con usuarios
 */
const usuarioService = {
  obtenerUsuarios: async () => {
    try {
      const response = await API.get("/usuarios");
      return response;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  obtenerUsuarioPorId: async (id) => {
    try {
      const response = await API.get(`/usuarios/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener usuarios con ID ${id}:`, error);
      throw error;
    }
  },

  obtenerUsuariosPorRoles: async (rol) => {
    try {
      const response = await API.get(`/usuarios/rol/${rol}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener usuarios por roles ${rol}:`, error);
      throw error;
    }
  },

  crearUsuario: async (usuario) => {
    try {
      const response = await API.post("/usuarios", usuario);
      return response;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  actualizarUsuario: async (id, usuario) => {
    try {
      const response = await API.put(`/usuarios/${id}`, usuario);
      return response;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Soft delete: cambia el estado activo del usuario
   * @param {number} id
   * @param {boolean} activo
   */
  toggleActivo: async (id, activo) => {
    try {
      const response = await API.patch(`/usuarios/${id}/activo`, { activo });
      return response;
    } catch (error) {
      console.error(`Error al cambiar estado de usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Hard delete: elimina usuario definitivamente (force)
   * @param {number} id
   */
  eliminarUsuarioForce: async (id) => {
    try {
      const response = await API.delete(`/usuarios/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar definitivamente usuario con ID ${id}:`, error);
      throw error;
    }
  },
};
  
  

export default usuarioService;
