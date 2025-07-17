import express from 'express'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

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
      {
        name: 'Autenticación',
        description: 'Operaciones de registro e inicio de sesión'
      },
      {
        name: 'Héroes',
        description: 'Operaciones relacionadas con héroes'
      },
      {
        name: 'Mascotas',
        description: 'Operaciones relacionadas con mascotas'
      }
    ],
    servers: [
      {
        url: 'http://localhost:3001/api',
      },
    ],
  },
  apis: ['./controllers/*.js', './routes/*.js'], // Agrega también las rutas
};

const swaggerSpec = swaggerJSDoc(options);

mongoose.connect('mongodb+srv://cesarley15:qWyMmxTAZJ1U7fPD@cluster0.asaxiov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

const app = express()

app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api', heroController)
app.use('/api', petController);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
