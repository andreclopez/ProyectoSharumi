import API from "./api";

/**
 * Servicio para gestionar las operaciones relacionadas con productos
 */
const productoService = {
  /**
   * Obtiene todos los productos
   * @returns {Promise} - Promesa con los datos de productos
   */
  obtenerProductos: async () => {
    try {
      const response = await API.get("/productos");
      return response; // devolvemos toda la respuesta, para usar .data en el Dashboard
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {number} id - ID del producto
   * @returns {Promise} - Promesa con los datos del producto
   */
  obtenerProductoPorId: async (id) => {
    try {
      const response = await API.get(`/productos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene productos por categoría
   * @param {string} categoria - Categoría a filtrar
   * @returns {Promise} - Promesa con los datos de productos
   */
  obtenerProductosPorCategoria: async (categoria) => {
    try {
      const response = await API.get(`/productos/categoria/${categoria}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${categoria}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto (para admin)
   * @param {Object} producto - Datos del producto
   * @returns {Promise}
   */
  crearProducto: async (producto) => {
    try {
      const response = await API.post("/productos", producto);
      return response;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente (para admin)
   * @param {number} id - ID del producto
   * @param {Object} producto - Datos a actualizar
   * @returns {Promise}
   */
  actualizarProducto: async (id, producto) => {
    try {
      const response = await API.put(`/productos/${id}`, producto);
      return response;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Inactiva un producto (activo = false)
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  inactivarProducto: async (id) => {
    try {
      const response = await API.patch(`/productos/${id}`, { activo: false });
      return response;
    } catch (error) {
      console.error(`Error al inactivar producto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   
  /**
   * Elimina un producto (para admin)
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  eliminarProducto: async (id) => {
    try {
      const response = await API.delete(`/productos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      throw error;
    }
  },
};

export default productoService;
