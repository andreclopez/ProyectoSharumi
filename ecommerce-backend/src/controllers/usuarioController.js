import { Usuario, Rol, Pedido, Carrito, Producto, Proveedor, CarritoxProducto, PedidoxProducto } from '../models/index.js';
import { validationResult } from 'express-validator';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: "Parámetros inválidos", 
        errors: errors.array(), 
      });
    }

    const { page = 1, limit = 10, } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    const usuarios = await Usuario.findAndCountAll({
      where: whereClause,
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] },
        { model: Carrito, as: 'carritos' },
        { model: Pedido, as: 'pedidos', attributes: ['id', 'estado'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fechaRegistro', 'DESC']], 
    });

    res.status(200).json({
      success: true,
      data: usuarios.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(usuarios.count / limit),
        totalItems: usuarios.count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: "Parámetros inválidos", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] },
        { model: Carrito, as: 'carritos' },
        { model: Pedido, as: 'pedidos', attributes: ['id', 'estado'] },
        { model: Producto, as: 'productos', include: [{ model: Proveedor, as: 'proveedor' }] },
      ]
    });

    if (!usuario) return res.status(404).json({ 
      success: false, 
      message: 'Usuario no encontrado' 
    });

    res.status(200).json({ 
      success: true, 
      data: usuario 
    });

  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ 
      success: false, 
      message: 'Datos de entrada inválidos', 
      details: errors.array() 
    });

    const { nombre, apellido, telefono, email, password, fechaRegistro, idRol } = req.body;

    // Validar rol o asignar null
    let rol = null;
    if (idRol) {
      rol = await Rol.findByPk(idRol);
      if (!rol) return res.status(400).json({ 
        success: false, 
        error: 'Rol no encontrado' 
      });
    }

    const nuevoUsuario = await Usuario.create({ nombre, apellido, telefono, email, password, fechaRegistro, idRol: rol?.id || null });

    const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.id, {
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] },
        { model: Carrito, as: 'carritos' },
        { model: Pedido, as: 'pedidos', attributes: ['id', 'estado'] },
      ]
    });

    res.status(201).json({ 
      success: true, 
      data: usuarioCompleto, 
      message: "Usuario creado exitosamente" 
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ 
      success: false, 
      message: "Parámetros inválidos", 
      errors: errors.array() 
    });

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ 
      success: false, 
      message: 'Usuario no encontrado' 
    });

    if (req.body.idRol) {
      const rol = await Rol.findByPk(req.body.idRol);
      if (!rol) return res.status(400).json({ 
        success: false, 
        error: "Rol no encontrado" 
      });
    }

    // Ignorar password si no se envía
    const dataToUpdate = { ...req.body };
    if (!dataToUpdate.password) delete dataToUpdate.password;

    await usuario.update(dataToUpdate);

    const usuarioActualizado = await Usuario.findByPk(id, {
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] },
        { model: Carrito, as: 'carritos' },
        { model: Pedido, as: 'pedidos', attributes: ['id', 'estado'] },
      ]
    });

    res.status(200).json({ success: true, data: usuarioActualizado });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
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

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Revisar carritos activos
    const carritos = await Carrito.findAll({ where: { idUsuario: id } }) || [];
    if (carritos.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el usuario porque tiene carritos activos."
      });
    }

    // Revisar pedidos activos
    const pedidos = await Pedido.findAll({ where: { idUsuario: id }} ) || [];
    if (pedidos.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar el usuario porque tiene pedidos activos.' 
      });
    } 

    // Si no hay carritos ni pedidos, borramos dependencias intermedias
    for (const carrito of carritos) {
      await CarritoxProducto.destroy({ where: { idCarrito: carrito.id } });
    }

    for (const pedido of pedidos) {
      await PedidoxProducto.destroy({ where: { idPedido: pedido.id } });
    }

    // Borrar usuario
    await usuario.destroy();

    res.status(200).json({ 
      success: true, 
      message: 'Usuario eliminado exitosamente' 
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    console.error(error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};
