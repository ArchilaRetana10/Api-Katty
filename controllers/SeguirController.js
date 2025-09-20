import pool from '../database/db.js';
import dayjs from 'dayjs';

// Seguir a un nuevo usuario
    export const seguirUsuario = async (req, res) => {
      try {
        const seguidor_id = req.usuario.id; 
        const { seguido } = req.body;     

        const usuarioSeguido = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [seguido]
        );

        if (usuarioSeguido.rows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const resultado = await pool.query(
          `INSERT INTO seguidores (seguidor_id, seguido_id) 
          VALUES ($1, $2) 
          RETURNING id, seguidor_id, seguido_id, created_at`,
          [seguidor_id, usuarioSeguido.rows[0].id]
        );

        const seguidorRegistro = resultado.rows[0];
        if (seguidorRegistro.created_at) {
          seguidorRegistro.created_at = dayjs(seguidorRegistro.created_at).format('DD-MM-YY HH:mm:ss');
        }

        res.status(201).json(seguidorRegistro);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al seguir usuario', detalle: error.message });
      }
    };

// Dejar de seguir a un usuario
    export const dejarDeSeguir = async (req, res) => {
      try {
        const seguidor_id = req.usuario.id; 
        const { seguido } = req.body;

        const resultSeguido = await pool.query('SELECT id FROM usuarios WHERE nombre_usuario = $1', [seguido]);

        if (resultSeguido.rows.length === 0) {
          return res.status(404).json({ error: 'Revisa el nombre del usuario, no existe ⊙﹏⊙' });
        }

        const seguido_id = resultSeguido.rows[0].id;

        const eliminar = await pool.query(
          'DELETE FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2 RETURNING *',
          [seguidor_id, seguido_id]
        );

        if (eliminar.rows.length === 0) {
          return res.status(400).json({ mensaje: 'Lo lamento pero no es posible dejar de seguir a este usuario, ya que no lo seguias con anterioridad' });
        }

        res.json({ mensaje: `Dejaste de seguir al usuario ${seguido}` });  
      } catch (error) {
        console.error('Error al dejar de seguir usuario:', error);
        res.status(500).json({ error: 'Error al dejar de seguir usuario' });
      }
    };

// Ver mensajes de las personas a las que se siguen
    export const mensajesDeSeguidos = async (req, res) => {
      try {
        const seguidor_id = req.usuario.id; 

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
        console.error('Error', error);
        res.status(500).json({ error: 'Error al obtener mensajes de seguidos' });
      }
    };