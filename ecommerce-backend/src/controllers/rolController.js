import { Rol } from '../models/index.js';
import { validationResult } from 'express-validator';

// Obtener todos los roles 
export const obtenerRoles = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Parámetros inválidos", errors: errors.array() });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const roles = await Rol.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: roles.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(roles.count / limit),
        totalItems: roles.count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener rol por ID
export const obtenerRolPorId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Parámetros inválidos", errors: errors.array() });
    }

    const { id } = req.params;
    const rol = await Rol.findByPk(id);

    if (rol) {
      res.status(200).json({ success: true, data: rol });
    } else {
      res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

  } catch (error) {
    console.error("Error al obtener rol por ID:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Crear rol
export const crearRol = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Datos de entrada inválidos", errors: errors.array() });
    }

    const { codigo, descripcion } = req.body;
    const nuevoRol = await Rol.create({ codigo, descripcion });

    res.status(201).json({ success: true, data: nuevoRol, message: "Rol creado exitosamente" });

  } catch (error) {
    console.error("Error al crear rol:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

