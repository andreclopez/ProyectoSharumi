import API from "./api";

/**
 * Servicio para gestionar las operaciones relacionadas con categorias
 */
const categoriaService = {
  /**
   * Obtiene todas las categorias
   * @returns {Promise} - Promesa con los datos de categorias
   */
  obtenerCategorias: async () => {
    try {
      const response = await API.get("/categorias");
      return response; // devolvemos toda la respuesta, para usar .data en el Dashboard
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  /**
   * Obtiene una categoria por su ID
   * @param {number} id - ID de la categoria
   * @returns {Promise} - Promesa con los datos de la categoria
   */
  obtenerCategoriaPorId: async (id) => {
    try {
      const response = await API.get(`/categorias/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener categoría por ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva categoria (para admin)
   * @param {Object} categoria - Datos de la categoria
   * @returns {Promise}
   */
  crearCategoria: async (categoria) => {
    try {
      const response = await API.post("/categorias", categoria);
      return response;
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      throw error;
    }
  },

  /**
   * Actualiza una categoria existente (para admin)
   * @param {number} id - ID de la categoria
   * @param {Object} categoria - Datos a actualizar
   * @returns {Promise}
   */
  actualizarCategoria: async (id, categoria) => {
    try {
      const response = await API.put(`/categorias/${id}`, categoria);
      return response;
    } catch (error) {
      console.error(`Error al actualizar categoría por ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una categoria (para admin)
   * @param {number} id - ID de la categoria
   * @returns {Promise}
   */
  eliminarCategoria: async (id) => {
    try {
      const response = await API.delete(`/categorias/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar categoría por ID ${id}:`, error);
      throw error;
    }
  },
};

export default categoriaService;
