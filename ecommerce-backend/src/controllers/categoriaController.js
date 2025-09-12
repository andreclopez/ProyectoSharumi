import { Categoria, Producto } from '../models/index.js';
import { validationResult } from 'express-validator';

export const obtenerCategoriasActivas = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de consulta inválidos",
        errors: errors.array(),
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const categorias = await Categoria.findAndCountAll({
      where: { activa: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    res.status(200).json({
      success: true,
      message: "Categorías obtenidas exitosamente",
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros inválidos",
        errors: errors.array(),
      });
    }

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

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    } 
      return res.status(200).json({ 
        success: true,
        message: 'Categoría obtenida exitosamente',
        data: categoria
     });
    } catch (error) {
      console.error("Error al obtener categoría por ID:", error);
      return res.status(500).json({ 
        success: false,
        message: 'Error interno del servidor', 
        error: error.message 
      });
    }
  };


export const crearCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array()
      });
    }

    const nuevaCategoria = await Categoria.create(req.body);

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: nuevaCategoria
    }); 
  } catch (error) {
    console.error("Error al crear categoría:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inváalidos",
        errors: errors.array()
      });
    }

    const datosActualizar = req.body;
    const categoria = await Categoria.findByPk(id);
    if (categoria) {
      const categoriaActualizada = await categoria.update(datosActualizar);
      res.status(200).json({
        success: true,
        message: "Categoría actualizada exitosamente",
        data: categoriaActualizada
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Categoría no encontrada para actualizar' 
      });
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Categoria.destroy({
      where: { id: id }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ 
        success: true,
        message: 'Categoría eliminada exitosamente' 
      }); 
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada para eliminar' 
      });
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};
