import express from 'express';
import { Pedido, Producto } from "../models/index.js"
import { validationResult, body, param } from 'express-validator';
import { 
  obtenerPedidosxProductosActivos, 
  obtenerPedidoxProductoPorId, 
  crearPedidoxProducto, 
  actualizarPedidoxProducto, 
  eliminarPedidoxProducto 
} from '../controllers/pedidoxProductoController.js';

const router = express.Router();

// Validaciones de FK
const validatePedidoXProductoFK = [
  body('idPedido')
    .notEmpty().withMessage('El idPedido es requerido')
    .isInt({ min: 1 }).withMessage('idPedido debe ser un número entero positivo')
    .custom(async (value) => {
      const pedido = await Pedido.findByPk(value);
      if (!pedido) return Promise.reject('El pedido no existe');
    }),
  body('idProducto')
    .notEmpty().withMessage('El idProducto es requerido')
    .isInt({ min: 1 }).withMessage('idProducto debe ser un número entero positivo')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) return Promise.reject('El producto no existe');
    })
];

// Listar activos
router.get('/', obtenerPedidosxProductosActivos);

// Obtener por ID
router.get('/:id', obtenerPedidoxProductoPorId);

// Crear
router.post('/', validatePedidoXProductoFK, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearPedidoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear pedidoxProducto', detalle: error.message });
  }
});

// Actualizar
router.put('/:id', validatePedidoXProductoFK, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarPedidoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar pedidoxProducto', detalle: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await eliminarPedidoxProducto(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar pedidoxProducto', detalle: error.message });
  }
});

export default router;
