import express from 'express';
import { 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario, 
  perfilController
} from '../controllers/usuarioController.js';
import { validateUsuarioCreate, validateId, validatePagination } from '../middleware/validation.js'; // Validaciones
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta perfil usuario (protegida)
router.get('/perfil', protect, perfilController);

// GET /api/usuarios - Obtener todos los usuarios
router.get(
  '/', 
  validatePagination, 
  obtenerUsuarios
);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get(
  '/:id', 
  validateId, 
  obtenerUsuarioPorId
);

// POST /api/usuarios - Crear usuario
router.post(
  '/', 
  validateUsuarioCreate, 
  async (req, res) => {
    try {
      await crearUsuario(req, res);
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error al crear usuario', error: error.message });
    }
  }
);

// PUT /api/usuarios/:id - Actualizar usuario
router.put(
  '/:id', 
  validateId, 
  validateUsuarioCreate, 
  async (req, res) => {
    try {
      await actualizarUsuario(req, res);
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
    }
  }
);

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    await eliminarUsuario(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

export default router;
