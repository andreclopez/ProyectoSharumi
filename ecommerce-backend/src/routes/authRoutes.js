import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

// Refrescar token
router.post('/refresh-token', refreshToken);

export default router;
