import express from 'express';
import { protect as verificarToken } from '../middleware/authMiddleware.js'
import { validationResult } from 'express-validator';
import {
    crearMensaje,
    obtenerMensajesPorProducto,
    obtenerMensajePorId,
    actualizarMensaje,
    eliminarMensaje
} from '../controllers/mensajeController.js';
import { validateMensajeCreate } from '../middleware/validation.js';

const router = express.Router({ mergeParams: true });

// Obtener mensajes por producto
router.get('/', obtenerMensajesPorProducto);

// Crear mensaje
router.post('/', [verificarToken, validateMensajeCreate], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    await crearMensaje(req, res);
});

// Obtener mensaje por ID
router.get('/:id', obtenerMensajePorId);

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
