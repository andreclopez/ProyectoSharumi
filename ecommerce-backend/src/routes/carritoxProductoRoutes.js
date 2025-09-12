import express from 'express';
import { Producto, Carrito } from '../models/index.js';
import { validationResult, body } from 'express-validator';
import { 
    obtenerCarritosxProductosActivos, 
    obtenerCarritoxProductoPorId, 
    crearCarritoxProducto,
    actualizarCarritoxProducto, 
    eliminarCarritoxProducto 
} from '../controllers/carritoxProductoController.js';

const router = express.Router();

// Validaciones de FK
export const validateCarritoXProductoFK = [
  body('idProducto')
    .notEmpty().withMessage('El idProducto es requerido')
    .isInt({ min: 1 }).withMessage('idProducto debe ser un número entero positivo')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) return Promise.reject('El producto no existe');
    }),
  body('idCarrito')
    .notEmpty().withMessage('El idCarrito es requerido')
    .isInt({ min: 1 }).withMessage('idCarrito debe ser un número entero positivo')
    .custom(async (value) => {
      const carrito = await Carrito.findByPk(value);
      if (!carrito) return Promise.reject('El carrito no existe');
    })
];

// Listar activos
router.get('/', obtenerCarritosxProductosActivos);

// Obtener por ID
router.get('/:id', obtenerCarritoxProductoPorId);

// Crear
router.post('/', validateCarritoXProductoFK, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearCarritoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear carritoxProducto', detalle: error.message });
  }
});

// Actualizar
router.put('/:id', validateCarritoXProductoFK, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarCarritoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar carritoxProducto', detalle: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await eliminarCarritoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar carritoxProducto', detalle: error.message });
  }
});

export default router;
