import { Router } from "express";
import carritoRoutes from './carritoRoutes.js';
import carritoxProductoRoutes from './carritoxProductoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import cuponDescuentoRoutes from './cuponDescuentoRoutes.js';
import pagoRoutes from './pagoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import pedidoxProductoRoutes from './pedidoxProductoRoutes.js';
import productoRoutes from './productoRoutes.js';
import proveedorRoutes from './proveedorRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import mensajeRoutes from './mensajeRoutes.js';
import rolRoutes from './rolRoutes.js'; 
import archivoRoutes from './archivoRoutes.js';
import sharuIaRoutes from './sharuIaRoutes.js';
import manejarEnvioContacto from '../controllers/contactoController.js';

const router = Router();

router.use('/carritos', carritoRoutes);
router.use('/carritosxProductos', carritoxProductoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/cupones', cuponDescuentoRoutes);
router.use('/pagos', pagoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/pedidosxProductos', pedidoxProductoRoutes);
router.use('/productos', productoRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/roles', rolRoutes); 
router.use('/files', archivoRoutes);
router.use('/ai', sharuIaRoutes);
router.post('/contacto', manejarEnvioContacto);

// Mensajes anidados por producto
router.use('/productos/:idProducto/mensajes', mensajeRoutes);

// Mensajes generales (opcional)
router.use('/mensajes', mensajeRoutes);

export default router;
