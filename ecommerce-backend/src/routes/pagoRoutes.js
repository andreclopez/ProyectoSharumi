import express from 'express';
import { validationResult, body } from 'express-validator';
import { 
    obtenerPagosActivos, 
    obtenerPagoPorId, 
    crearPago, 
    actualizarPago, 
    eliminarPago 
} from '../controllers/pagoController.js';
import { Pedido } from '../models/index.js';   // ✅ importamos Pedido

const router = express.Router();

//Validaciones de creación/actualización de pago
const validatePago = [
  body('idPedido')
    .notEmpty().withMessage('El idPedido es requerido')
    .isInt({ min: 1 }).withMessage('idPedido debe ser un número entero positivo')
    .custom(async (value) => {
      const pedido = await Pedido.findByPk(value); // ✅ usamos Pedido importado
      if (!pedido) throw new Error('El pedido no existe');
    }),
  body('monto')
    .notEmpty().withMessage('El monto es requerido')
    .isFloat({ min: 0 }).withMessage('El monto debe ser un número mayor o igual a 0'),
  body('metodoPago')
    .notEmpty().withMessage('El método de pago es requerido')
    .isLength({ max: 50 }).withMessage('El método de pago no puede exceder 50 caracteres'),
  body('estado')
    .optional()
    .isIn(['pendiente', 'completado', 'cancelado']).withMessage('Estado inválido')
];

//Listar pagos activos
router.get('/', obtenerPagosActivos);

//Obtener pago por ID
router.get('/:id', obtenerPagoPorId);

//Crear pago
router.post('/', validatePago, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    await crearPago(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear pago', detalle: error.message });
  }
});

//Actualizar pago
router.put('/:id', validatePago, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    await actualizarPago(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar pago', detalle: error.message });
  }
});

//Eliminar pago
router.delete('/:id', async (req, res) => {
  try {
    await eliminarPago(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar pago', detalle: error.message });
  }
});

export default router;
