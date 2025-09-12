import express from 'express';
import { validationResult, body } from 'express-validator';
import { 
    obtenerCuponesActivos, 
    obtenerCuponPorId, 
    crearCupon, 
    actualizarCupon, 
    eliminarCupon,
    validarCuponPorCodigo
} from '../controllers/cuponDescuentoController.js';

const router = express.Router();

// Validaciones de creación/actualización
const validateCupon = [
  body('codigoCupon')
    .notEmpty().withMessage('El código del cupón es requerido')
    .isLength({ min: 2, max: 20 }).withMessage('El código debe tener entre 2 y 20 caracteres'),
  body('descuento')
    .notEmpty().withMessage('El descuento es requerido')
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe ser un número entre 0 y 100'),
  body('fechaExpiracion')
    .optional()
    .isISO8601().withMessage('La fecha de expiración debe ser una fecha válida (YYYY-MM-DD)')
];

// Listar cupones activos
router.get('/', obtenerCuponesActivos);

// Validar cupón por código
router.get('/validar/:codigoCupon', validarCuponPorCodigo);

// Obtener por ID
router.get('/:id', obtenerCuponPorId);

// Crear cupón
router.post('/', validateCupon, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearCupon(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear cupón', detalle: error.message });
  }
});

// Actualizar cupón
router.put('/:id', validateCupon, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarCupon(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar cupón', detalle: error.message });
  }
});

// Eliminar cupón
router.delete('/:id', async (req, res) => {
  try {
    // Aquí podrías agregar chequeo si el cupón está en uso
    await eliminarCupon(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar cupón', detalle: error.message });
  }
});

export default router;
