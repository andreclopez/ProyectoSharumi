import { Producto, PedidoxProducto, CarritoxProducto, Mensaje } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

// Obtener todos los productos (con filtros opcionales)
export const obtenerProductos = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de consulta inválidos",
        errors: errors.array(),
      });
    }

    const { page = 1, limit = 10, categoria, oferta, descuentoMin, } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (categoria) {
      whereClause.categoria = categoria;
    }
    if (oferta === 'true') {
      whereClause.oferta = true;
    }
    if (descuentoMin) {
      whereClause.descuento = { [Op.gte]: Number(descuentoMin) };
    }

    const productos = await Producto.findAndCountAll({ 
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fechaAlta', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: "Productos obtenidos exitosamente",
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
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
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Producto obtenido exitosamente",
      data: producto
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// Crear producto (solo admin)
export const crearProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array()
      });
    }

    const { nombre, descripcion, precio, stock, imagenUrl, idUsuario, oferta, descuento } = req.body;
    
    const nuevoProducto = await Producto.create({
      nombre, 
      descripcion, 
      precio,
      stock, 
      imagenUrl,
      idUsuario,
      oferta: oferta ?? false,    
      descuento: descuento ?? 0   
    });

    return res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: nuevoProducto
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// Actualizar producto (solo admin)
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array()
      });
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado para actualizar"
      });
    }

    const productoActualizado = await producto.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// Eliminar producto (hard delete con limpieza de relaciones)
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    // Borrar dependencias primero
    await Mensaje.destroy({ where: { idProducto: id } });
    await CarritoxProducto.destroy({ where: { idProducto: id } });
    await PedidoxProducto.destroy({ where: { idProducto: id } });

    // Finalmente, eliminar el producto
    await producto.destroy();

    res.status(200).json({
      success: true,
      message: "Producto eliminado en cascada (manual)"
    });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};
