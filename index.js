import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './route/user.js';
import mensajeRoutes from './route/mensaje.js';
import seguidorRoutes from './route/seguidor.js';
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';  

dotenv.config();
const app = express();

const swaggerDocument = YAML.load('./Aqui.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());
app.use(cookieParser()); 
app.use('/api', userRoutes);
app.use('/api', mensajeRoutes);
app.use('/api', seguidorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});