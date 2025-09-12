import express from 'express';
import { validationResult, body, param } from 'express-validator';
import { 
    obtenerProveedoresActivos, 
    obtenerProveedorPorCuit, 
    crearProveedor, 
    actualizarProveedor, 
    eliminarProveedor 
} from '../controllers/proveedorController.js';

const router = express.Router();

// Validaciones de creación/actualización de proveedor
const validateProveedor = [
  body('cuit')
    .notEmpty().withMessage('El CUIT es requerido')
    .isLength({ min: 11, max: 11 }).withMessage('El CUIT debe tener 11 caracteres'),
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  body('telefono')
    .optional()
    .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail()
];

// Listar proveedores activos
router.get('/', obtenerProveedoresActivos);

// Obtener proveedor por CUIT
router.get('/:cuit', obtenerProveedorPorCuit);

// Crear proveedor
router.post('/', validateProveedor, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearProveedor(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear proveedor', detalle: error.message });
  }
});

// Actualizar proveedor
router.put('/:cuit', validateProveedor, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarProveedor(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar proveedor', detalle: error.message });
  }
});

// Eliminar proveedor
router.delete('/:cuit', async (req, res) => {
  try {
    // Aquí podrías agregar chequeo si el proveedor tiene productos asociados
    await eliminarProveedor(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar proveedor', detalle: error.message });
  }
});

export default router;
