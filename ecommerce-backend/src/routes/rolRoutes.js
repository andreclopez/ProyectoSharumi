import express from 'express';
import { 
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
} from '../controllers/rolController.js';

const router = express.Router();

router.get('/', obtenerRoles);
router.get('/:id', obtenerRolPorId);
router.post('/', crearRol);

export default router;
