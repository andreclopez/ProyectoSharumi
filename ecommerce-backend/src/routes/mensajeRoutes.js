import express from 'express';
import { validationResult } from 'express-validator';
import {
    crearMensaje,
    obtenerTodosLosMensajes,
    obtenerMensajePorProducto,
    obtenerMensajePorId,
    actualizarMensaje,
    eliminarMensaje
} from '../controllers/mensajeController.js';
import { validateMensajeCreate } from '../middleware/validation.js';

const router = express.Router({ mergeParams: true });

// Listar todos los mensajes
router.get('/', obtenerTodosLosMensajes);

// Obtener mensajes por producto
router.get('/producto/:idProducto', obtenerMensajePorProducto);

// Obtener mensaje por ID
router.get('/:id', obtenerMensajePorId);

// Crear mensaje
router.post('/:idProducto', validateMensajeCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    await crearMensaje(req, res);
});

// Actualizar mensaje
router.put('/:id', validateMensajeCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    await actualizarMensaje(req, res);
});

// Eliminar mensaje
router.delete('/:id', async (req, res) => {
    await eliminarMensaje(req, res);
});

export default router;
