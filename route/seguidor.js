import express from 'express';
import { 
  seguirUsuario, 
  dejarDeSeguir, 
  mensajesDeSeguidos, 
  verSeguidores, 
  verSeguidos 
} from '../controllers/SeguidorController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verificarToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }
    req.usuario = usuario;
    next();
  });
};

router.post('/seguir', verificarToken, seguirUsuario);
router.delete('/seguir', verificarToken, dejarDeSeguir);
router.get('/mensajes/seguidos/:nombre_usuario', verificarToken, mensajesDeSeguidos);
router.get('/seguidores/:nombre_usuario', verificarToken, verSeguidores);
router.get('/siguiendo/:nombre_usuario', verificarToken, verSeguidos);

export default router;
