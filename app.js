// index.js
import express from 'express';
import heroController from './controllers/heroController.js';
import petController from './controllers/petController.js';
// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comentando temporalmente la configuración de Swagger
/*
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Superhéroes',
      version: '1.0.0',
      description: 'Documentación de la API de Superhéroes',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Autenticación', description: 'Operaciones de registro e inicio de sesión' },
      { name: 'Héroes', description: 'Operaciones relacionadas con héroes' },
      { name: 'Mascotas', description: 'Operaciones relacionadas con mascotas' },
    ],
    servers: [
      {
        url: 'https://api-superheroes-8my1.onrender.com/api',
      },
    ],
  },
  apis: ['./controllers/*.js', './routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
*/

mongoose.connect('mongodb+srv://cesarley15:qWyMmxTAZJ1U7fPD@cluster0.asaxiov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, 'pou-frontend')));

// Rutas de API - Con ambos controladores
app.use('/auth', authRoutes);
app.use('/api', heroController);
app.use('/api', petController);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Para cualquier otra ruta, sirve el index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pou-frontend', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
