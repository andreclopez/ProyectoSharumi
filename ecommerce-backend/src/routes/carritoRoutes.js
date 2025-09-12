import express from 'express';
import { validationResult } from 'express-validator';
import { 
  obtenerCarritosActivos, 
  obtenerCarritoPorId, 
  crearCarrito, 
  actualizarCarrito, 
  eliminarCarrito 
} from '../controllers/carritoController.js';
import { validateCarritoCreate } from '../middleware/validation.js'; 

const router = express.Router();

// Listar carritos activos
router.get('/', obtenerCarritosActivos);

// Obtener carrito por ID
router.get('/:id', obtenerCarritoPorId);

// Crear carrito
router.post('/', validateCarritoCreate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  await crearCarrito(req, res);
});

// Actualizar carrito
router.put('/:id', validateCarritoCreate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  await actualizarCarrito(req, res);
});

// Eliminar carrito
router.delete('/:id', eliminarCarrito);

export default router;
