import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USUARIO,
  host: process.env.DB_HOST,
  database: process.env.DB_NOMBRE,
  password: process.env.DB_CONTRASENA,
  port: process.env.DB_PUERTO,
});

export default pool;
