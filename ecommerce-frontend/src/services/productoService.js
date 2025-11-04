import API from "./api";

/**
 * Servicio para gestionar las operaciones relacionadas con productos
 */
const productoService = {
  /**
   * Obtiene todos los productos
   */
  obtenerProductos: async () => {
    try {
      const response = await API.get("/productos");
      return response;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por su ID
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
   * Si el producto incluye imágenes, debe enviarse como FormData.
   */
  crearProducto: async (producto) => {
    try {
      const isFormData = producto instanceof FormData;
      const response = await API.post("/productos", producto, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  
  /**
   * Subir galeria
   */
  subirGaleria: async (id, data) => {
    try {
      const res = await API.post(`/productos/${id}/galeria`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',  
        }
      });
      return res;

    } catch (error) {
      console.log("Error al subir la imagen:", error)
      throw error;
    }
  },
  
   /**
   * Actualiza solo la portada de un producto (ruta separada para subir imagen)
   * @param {number} id - ID del producto
   * @param {FormData} data - FormData con el campo 'portada'
   */
  actualizarPortada: async (id, formData, token) => {
    try {
      const response = await API.put(`/productos/${id}/portada`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',  
            'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar la portada del producto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente (para admin)
   * Puede recibir JSON o FormData (para editar con imagen).
   */
  actualizarProducto: async (id, producto) => {
    try {
      const isFormData = producto instanceof FormData;
      const response = await API.put(`/productos/${id}`, producto, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Inactiva un producto (activo = false)
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
   * Elimina un producto (para admin)
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
