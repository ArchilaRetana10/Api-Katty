import pool from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const { correo, contrasena, nombre_usuario } = req.body;

    const veriEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!veriEmail.test(correo)) {
      return res.status(400).json({ error: 'Formato de correo electrónico no valido ಠ_ಠ' });
    }

    const correoExistente = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );
    if (correoExistente.rows.length > 0) {
      return res.status(409).json({ error: 'Uuuuu lo sentimos, ya hay un usuario con ese correo, ingresa otro' });
    }

    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ error: 'Este nombre de usuario ya existe Prueba con otro nombre de usuairo O.O' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (correo, contrasena, nombre_usuario) 
       VALUES ($1, $2, $3) 
       RETURNING id, correo, nombre_usuario, created_at`,
      [correo, hash, nombre_usuario]
    );

    const usuario = resultado.rows[0];
    if (usuario.created_at) {
      usuario.created_at = dayjs(usuario.created_at).format('DD-MM-YY HH:mm:ss');
    }

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};

// Inicio de sesión
export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = resultado.rows[0];
    const validarContrasena = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!validarContrasena) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    res.json({ mensaje: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error en el inicio de sesión', detalle: error.message });
  }
};

//Eliminar el usuario que esta logiado
    export const eliminarMiPerfil = async (req, res) => {
      try {
        const usuarioId = req.usuario.id; 

        const resultado = await pool.query(
          'DELETE FROM usuarios WHERE id = $1 RETURNING *',
          [usuarioId]
        );

        if (resultado.rows.length === 0) {
          return res.status(404).json({ error: 'No se pudo eliminar el usuario. Es posible que no exista 🙊' });
        }

        res.clearCookie('token');

        res.json({ mensaje: 'Tu perfil ha sido eliminado correctamente ╯︿╰' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar el perfil', detalle: error.message });
      }
    };


// Obtener usuario por nombre_usuario
    export const obtenerUsuarioPorNombre = async (req, res) => {
      try {
        const { nombre_usuario } = req.params;

        const resultado = await pool.query(
          `SELECT id, correo, nombre_usuario, fecha_creacion 
          FROM usuarios WHERE nombre_usuario = $1`,
          [nombre_usuario]
        );

        if (resultado.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(resultado.rows[0]);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
      }
    };

    export const cerrarSesion = (req, res) => {
      res.clearCookie('token');
      res.json({ mensaje: 'Sesión cerrada correctamente' });
    };