import API from "./api";

/**
 * Servicio para gestionar las operaciones relacionadas con categorías
 */
const categoriaService = {
  /**
   * Obtiene todas las categorías
   * @returns {Promise} - Promesa con la lista de categorías
   */
  obtenerCategorias: async () => {
    try {
      const response = await API.get("/categorias");
      return response; // usar response.data en el frontend
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  /**
   * Obtiene una categoría por su ID
   * @param {number} id - ID de la categoría
   * @returns {Promise} - Promesa con los datos de la categoría
   */
  obtenerCategoriaPorId: async (id) => {
    try {
      const response = await API.get(`/categorias/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva categoría (para admin)
   * @param {Object} categoria - Datos de la categoría (puede incluir imagen)
   * @param {boolean} isMultipart - Indica si el envío es FormData (subida de imagen)
   * @returns {Promise}
   */
  crearCategoria: async (categoria) => {
    try {
      const isFormData = categoria instanceof FormData;
       
      const response = await API.post("/categorias", categoria, {
        // Establecer Content-Type solo para FormData
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  },

  /**
   * Actualiza una categoría existente (para admin)
   * @param {number} id - ID de la categoría
   * @param {Object} categoria - Datos a actualizar (puede incluir nueva portada)
   * @param {boolean} isMultipart - Indica si el envío es FormData
   * @returns {Promise}
   */
  actualizarCategoria: async (id, categoria) => {
    try {
      const isFormData = categoria instanceof FormData;
      
      const response = await API.put(`/categorias/${id}`, categoria, {
        // La magia: solo añade el header si es FormData
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar categoria con ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Elimina una categoría (para admin)
   * @param {number} id - ID de la categoría
   * @returns {Promise}
   */
  eliminarCategoria: async (id) => {
    try {
      const response = await API.delete(`/categorias/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza SOLO la portada de una categoría
   * @param {number} id - ID de la categoría
   * @param {FormData} fileData - FormData con la clave 'portada'
   * @returns {Promise}
   */
  actualizarPortada: async (id, fileData) => {
    try {
      const response = await API.put(`/categorias/${id}/portada`, fileData,{
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar la portada con ID ${id}:`, error);
      throw error;
    }
  },
  
};

export default categoriaService;
