import express from 'express';
import { 
  crearUsuario, 
  iniciarSesion, 
  obtenerUsuarioPorNombre, 
  eliminarMiPerfil,
  cerrarSesion 

} from '../controllers/UserController.js';
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


router.post('/usuarios', crearUsuario);
router.post('/login', iniciarSesion);
router.get('/usuarios/nombre/:nombre_usuario', obtenerUsuarioPorNombre);
router.delete('/usuarios/mi-perfil', verificarToken, eliminarMiPerfil);
router.get('/logout', cerrarSesion); 

export default router;
