import express from 'express';
import { 
  crearMensaje, 
  buscarMensajes, 
  obtenerMensajesPorUsuario,
  obtenerUltimosMensajes
}
from '../controllers/MensajeController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const verificarToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado vuelve a iniciar sesión" });
    }
    req.usuario = usuario;
    next();
  });
};

router.post('/mensajes', verificarToken, crearMensaje);
router.get('/mensajes/buscar', verificarToken, buscarMensajes);
router.get('/mensajes/ultimos', verificarToken, obtenerUltimosMensajes); 
router.get('/mensajes/usuario/:nombre_usuario', obtenerMensajesPorUsuario);

export default router;