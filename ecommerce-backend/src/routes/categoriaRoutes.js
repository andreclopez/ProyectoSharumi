import express from 'express';
import { Producto } from '../models/index.js';
import { validationResult, body, param } from 'express-validator';
import {
    obtenerCategoriasActivas, 
    obtenerCategoriaPorId, 
    crearCategoria, 
    actualizarCategoria, 
    eliminarCategoria 
} from '../controllers/categoriaController.js';

const router = express.Router();

// Validación de creación/actualización
const validateCategoria = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
];

// Listar categorías activas
router.get('/', obtenerCategoriasActivas);

// Obtener por ID
router.get('/:id', obtenerCategoriaPorId);

// Crear categoría
router.post('/', validateCategoria, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearCategoria(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear categoría', detalle: error.message });
  }
});

// Actualizar categoría
router.put('/:id', validateCategoria, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarCategoria(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar categoría', detalle: error.message });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const categoriaId = req.params.id;

    const tieneProductos = await Producto.count({ where: { idCategoria: categoriaId } });

    if (tieneProductos) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    await eliminarCategoria(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar categoría', detalle: error.message });
  }
});

export default router;
