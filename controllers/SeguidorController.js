import pool from '../database/db.js';
import dayjs from 'dayjs';

//Seguir a un usuario
    export const seguirUsuario = async (req, res) => {
      try {
        const seguidor_id = req.usuario.id; 
        const { seguido } = req.body;       

        const usuarioSeguido = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [seguido]
        );

        if (usuarioSeguido.rows.length === 0) {
          return res.status(404).json({ error: 'No se encontro a ese usuario, intenta con otro nombre de usuario' });
        }

        const resultado = await pool.query(
          `INSERT INTO seguidores (seguidor_id, seguido_id) 
          VALUES ($1, $2) 
          RETURNING id, seguidor_id, seguido_id, created_at`,
          [seguidor_id, usuarioSeguido.rows[0].id]
        );

        const registro = resultado.rows[0];
        if (registro.created_at) {
          registro.created_at = dayjs(registro.created_at).format('DD-MM-YY HH:mm:ss');
        }

        res.status(201).json(registro);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al seguir usuario', detalle: error.message });
      }
    };


//Dejar de seguir a un usuario
    export const dejarDeSeguir = async (req, res) => {
      try {
        const seguidor_id = req.usuario.id; 
        const { seguido } = req.body;

        const usuarioSeguido = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [seguido]
        );

        if (usuarioSeguido.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario seguido no encontrado' });
        }

        await pool.query(
          'DELETE FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2',
          [seguidor_id, usuarioSeguido.rows[0].id]
        );

        res.json({ mensaje: `Dejaste de seguir a ${seguido}` });
      } catch (error) {
        console.error('Error al dejar de seguir:', error);
        res.status(500).json({ error: 'Error al dejar de seguir', detalle: error.message });
      }
    };

// Ver mensajes de usuarios seguidos
    export const mensajesDeSeguidos = async (req, res) => {
      try {
        const { nombre_usuario } = req.params;

        const resultUsuario = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [nombre_usuario]
        );
        if (resultUsuario.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const seguidor_id = resultUsuario.rows[0].id;

        const resultado = await pool.query(
          `SELECT m.id, m.contenido, m.fecha_creacion, u.nombre_usuario
          FROM mensajes m
          JOIN usuarios u ON m.usuario_id = u.id
          JOIN seguidores s ON s.seguido_id = u.id
          WHERE s.seguidor_id = $1
          ORDER BY m.fecha_creacion DESC`,
          [seguidor_id]
        );

        res.json(resultado.rows);
      } catch (error) {
        console.error('Error al obtener mensajes de seguidos:', error);
        res.status(500).json({ error: 'Error al obtener mensajes de seguidos' });
      }
    };

// Ver seguidores de un usuario
    export const verSeguidores = async (req, res) => {
      try {
        const { nombre_usuario } = req.params;

        const usuario = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [nombre_usuario]
        );

        if (usuario.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuario.rows[0].id;

        const resultado = await pool.query(
          `SELECT u.nombre_usuario 
          FROM seguidores s
          JOIN usuarios u ON s.seguidor_id = u.id
          WHERE s.seguido_id = $1`,
          [usuario_id]
        );

        res.json({ usuario: nombre_usuario, seguidores: resultado.rows });
      } catch (error) {
        console.error('Error al obtener seguidores:', error);
        res.status(500).json({ error: 'Error al obtener seguidores' });
      }
    };

//Ver a quién sigue un usuario
    export const verSeguidos = async (req, res) => {
      try {
        const { nombre_usuario } = req.params;

        const usuario = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [nombre_usuario]
        );

        if (usuario.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuario.rows[0].id;

        const resultado = await pool.query(
          `SELECT u.nombre_usuario 
          FROM seguidores s
          JOIN usuarios u ON s.seguido_id = u.id
          WHERE s.seguidor_id = $1`,
          [usuario_id]
        );

        res.json({ usuario: nombre_usuario, siguiendo: resultado.rows });
      } catch (error) {
        console.error('Error al obtener seguidos:', error);
        res.status(500).json({ error: 'Error al obtener seguidos' });
      }
    };
