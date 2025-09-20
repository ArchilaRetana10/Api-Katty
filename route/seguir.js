import express from 'express';
import { seguirUsuario, dejarDeSeguir, mensajesDeSeguidos } from '../controllers/SeguirController.js';

const router = express.Router();

router.post('/seguir', seguirUsuario);
router.delete('/seguir', dejarDeSeguir);
router.get('/mensajes/seguidos/:nombre_usuario', mensajesDeSeguidos);

export default router;
