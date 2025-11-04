import express from "express";
import { upload, uploadMultiple } from "../middleware/multerMiddleware.js"; 
import validateExistencia from "../middleware/validateExistencia.js";
import { Producto, Archivo } from "../models/index.js";
import {
  subirArchivos,
  obtenerArchivosPorProducto,
  obtenerGaleria,
  actualizarGaleria,
  descargarArchivo,
  eliminarArchivo,
  eliminarArchivosDeProducto,
  servirImagen,
} from "../controllers/archivoController.js";
import { Op } from "sequelize";

const router = express.Router();

// --- SUBIR ARCHIVOS ---
router.post(
  '/upload/:idProducto',
  validateExistencia(Producto, 'idProducto'),
  upload.array('archivos', 10),
  subirArchivos
);

// --- OBTENER ARCHIVOS DE UN PRODUCTO ---
router.get(
  '/productos/:idProducto',
  validateExistencia(Producto, 'idProducto'),
  obtenerArchivosPorProducto
);

// --- OBTENER TODOS LOS ARCHIVOS (dashboard admin) ---
router.get('/', async (req, res) => {
  try {
    const archivosProducto = await Archivo.findAll({ where: { idProducto: { [Op.ne]: null } } });
    const archivosCategoria = await Archivo.findAll({ where: { idCategoria: { [Op.ne]: null } } });
    res.json({ archivos: [...archivosProducto, ...archivosCategoria] });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GALERIA
router.post('/:id/galeria', upload.array('imagenes', 10), actualizarGaleria);
router.get('/:id/galeria', obtenerGaleria);

// --- ELIMINAR ARCHIVO INDIVIDUAL ---
router.delete('/archivo/:id', eliminarArchivo);

// --- ELIMINAR TODOS LOS ARCHIVOS DE UN PRODUCTO ---
router.delete(
  '/producto/:idProducto',
  validateExistencia(Producto, 'idProducto'),
  eliminarArchivosDeProducto
);

// --- DESCARGAR ARCHIVO ---
router.get('/download/:fileName', descargarArchivo);

// --- SERVIR IMÁGENES DE PRODUCTOS ---
router.get('/image/:fileName', servirImagen);

// --- SERVIR IMÁGENES DE CATEGORIAS ---
// router.get('/image/categoria/:fileName', servirImagenCategoria());

export default router;
