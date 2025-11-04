import express from 'express';
import { controladorConsultaIA } from '../controllers/sharuIaController.js'

const router = express.Router();

router.post("/chat", controladorConsultaIA);

export default router;