import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://cesarley15:qWyMmxTAZJ1U7fPD@cluster0.asaxiov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// Solo rutas de autenticación (sin controladores problemáticos)
app.use('/auth', authRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

// Servir archivos estáticos
app.use(express.static('./pou-frontend'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba corriendo en http://localhost:${PORT}`);
}); 