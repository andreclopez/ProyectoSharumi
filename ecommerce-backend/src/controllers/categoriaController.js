import { Categoria, Producto } from '../models/index.js';

export const obtenerCategoriasActivas = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { activa: true }
    });
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id, { 
      include: [
        {
          model: Producto,
          as: 'productos', 
          attributes: ['id', 'nombre', 'precio'] 
        }
      ]
    });

    if (categoria) {
      res.status(200).json(categoria);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error("Error al obtener categoría por ID:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria.create(req.body);
    res.status(201).json(nuevaCategoria); 
  } catch (error) {
    console.error("Error al crear categoría:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const categoria = await Categoria.findByPk(id);
    if (categoria) {
      const categoriaActualizada = await categoria.update(datosActualizar);
      res.status(200).json(categoriaActualizada);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Categoria.destroy({
      where: { id: id }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ message: 'Categoría eliminada exitosamente' }); 
    } else {
      res.status(404).json({ message: 'Categoría no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
