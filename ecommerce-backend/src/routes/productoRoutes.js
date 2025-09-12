import express from 'express';
import { validateProductoCreate, validateProductoFK, validateProductoUpdate } from '../middleware/validation.js';
import { validationResult } from 'express-validator';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js';

const router = express.Router();

// Listar productos
router.get('/', obtenerProductos);

// Obtener producto por ID
router.get('/:id', obtenerProductoPorId);

// Crear producto
router.post('/', [...validateProductoCreate, ...validateProductoFK], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    await crearProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear producto', detalle: error.message });
  }
});

// Actualizar producto
router.put('/:id', [...validateProductoUpdate, ...validateProductoFK], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    await actualizarProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar producto', detalle: error.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await eliminarProducto(req, res); // llama al controller para hacer limpieza manual y realizar el hard delete
  } catch (error) {
    res.status(400).json({ 
      success: false,
      mensaje: 'Error al eliminar producto', 
      detalle: error.message 
    });
  }
});

export default router;
