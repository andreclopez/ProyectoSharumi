import express from 'express';
import { Producto } from '../models/index.js';
import { uploadCategoria } from '../middleware/multerMiddleware.js';
import { validationResult, body, param } from 'express-validator';
import { validateCategoriaCreate, validateCategoriaUpdate } from '../middleware/validation.js';
import {
    obtenerCategoriasActivas, 
    obtenerCategoriaPorId, 
    crearCategoria, 
    actualizarCategoria, 
    actualizarPortadaCategoria,
    eliminarCategoria 
} from '../controllers/categoriaController.js';

const router = express.Router();

// Listar categorías activas
router.get('/', obtenerCategoriasActivas);

// Obtener por ID
router.get('/:id', obtenerCategoriaPorId);

// Crear categoría
router.post('/', 
  uploadCategoria.single('portada'),
  [...validateCategoriaCreate],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await crearCategoria(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear categoría', detalle: error.message });
  }
});


// Actualizar categoría
router.put('/:id', 
  [...validateCategoriaUpdate],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    await actualizarCategoria(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar categoría', detalle: error.message });
  }
});

// Actualizar solo la portada
router.put(
  '/:id/portada', 
  uploadCategoria.single('portada'), 
  async (req, res) => {
    try {
        await actualizarPortadaCategoria(req, res); 
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar portada', detalle: error.message })
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
