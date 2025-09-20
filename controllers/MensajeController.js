import pool from '../database/db.js';
import dayjs from 'dayjs';

//Nuevo mensaje
    export const crearMensaje = async (req, res) => {
      try {
        const { contenido } = req.body;
        const usuario_id = req.usuario.id; 

        const resultado = await pool.query(
          `INSERT INTO mensajes (usuario_id, contenido) 
          VALUES ($1, $2) 
          RETURNING id, usuario_id, contenido, created_at`,
          [usuario_id, contenido]
        );

        const mensaje = resultado.rows[0];
        if (mensaje.created_at) {
          mensaje.created_at = dayjs(mensaje.created_at).format('DD-MM-YY HH:mm:ss');
        }

        res.status(201).json(mensaje);
      } catch (error) {
        console.error('Error al crear mensaje:', error);
        res.status(500).json({ error: 'Error al crear mensaje', detalle: error.message });
      }
    };

// Buscar mensajes por palabra relacionada
    export const buscarMensajes = async (req, res) => {
      try {
        const { q } = req.query; 

        if (!q) {
          return res.status(400).json({ error: 'Recuerda que debes de colocar un término de búsqueda en el parámetro' });
        }

        const resultado = await pool.query(
          `SELECT m.id, m.contenido, m.fecha_creacion, u.nombre_usuario
          FROM mensajes m
          JOIN usuarios u ON m.usuario_id = u.id
          WHERE m.contenido ILIKE $1
          ORDER BY m.fecha_creacion DESC`,
          [`%${q}%`]
        );

        res.json(resultado.rows);
      } catch (error) {
        console.error('LO SENTIMOS :( Error al buscar mensajes:', error);
        res.status(500).json({ error: 'Error al buscar mensajes', detalle: error.message });
      }
    };

// Obtener mensajes de un usuario en especifico
    export const obtenerMensajesPorUsuario = async (req, res) => {
      try {
        const { nombre_usuario } = req.params;

        const usuario = await pool.query(
          'SELECT id FROM usuarios WHERE nombre_usuario = $1',
          [nombre_usuario]
        );

        if (usuario.rows.length === 0) {
          return res.status(404).json({ error: 'Uuuuuppppsss... no encontramos el usuario' });
        }

        const usuario_id = usuario.rows[0].id;

        const resultado = await pool.query(
          `SELECT m.id, m.contenido, m.fecha_creacion 
          FROM mensajes m 
          WHERE m.usuario_id = $1 
          ORDER BY m.fecha_creacion DESC 
          LIMIT 10`,
          [usuario_id]
        );

        res.json(resultado.rows);
      } catch (error) {
        console.error('Error al obtener mensajes del usuario:', error);
        res.status(500).json({ error: 'Error' });
      }
    };

//Ultimos 10 mensajes
    export const obtenerUltimosMensajes = async (req, res) => {
      try {
        const resultado = await pool.query(
          `SELECT m.id, m.contenido, m.fecha_creacion, u.nombre_usuario
          FROM mensajes m
          JOIN usuarios u ON m.usuario_id = u.id
          ORDER BY m.fecha_creacion DESC
          LIMIT 10`
        );

        res.json(resultado.rows);
      } catch (error) {
        console.error('Error al obtener los últimos mensajes:', error);
        res.status(500).json({ error: 'Error al obtener los últimos mensajes' });
      }
    };