import express from 'express';
import { validateProductoCreate, validateProductoFK, validateProductoUpdate } from '../middleware/validation.js';
import { uploadPortada, uploadMultiple, uploadFields } from '../middleware/multerMiddleware.js'
import { validationResult } from 'express-validator';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js';
import { subirArchivos } from '../controllers/archivoController.js';

const router = express.Router();

// Listar productos
router.get('/', obtenerProductos);

// Obtener producto por ID
router.get('/:id', obtenerProductoPorId);

// Crear producto
router.post(
  '/',
  uploadFields,
  [...validateProductoCreate, ...validateProductoFK],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    try {
      await crearProducto(req, res);
    } catch (error) {
      console.error(error);
      res.status(400).json({ mensaje: 'Error al crear producto', detalle: error.message });
    }
  }
);

// Subir Archivos a la Galería del Producto 
router.post(
  '/:id/galeria',
  uploadMultiple('archivos', 10),
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, mensaje: "No se encontraron archivos para subir" });
    }
    
    req.foundRecord = { id: req.params.id }; 
    
    try {
      await subirArchivos(req, res); 
    } catch (error) {
      console.error(error);
      res.status(400).json({ mensaje: 'Error al subir la galería', detalle: error.message });
    }
  }
);

// Actualizar portada de producto
router.put(
  '/:id/portada',
  uploadPortada.single('portada'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, mensaje: "No se encontró el archivo de portada" });
    }
    try {
      await actualizarProducto(req, res);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar portada', detalle: error.message });
    }
  }
);

// Actualizar producto (PUT JSON para datos)
router.put(
  '/:id', 
  [...validateProductoUpdate], 
  actualizarProducto 
);


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
