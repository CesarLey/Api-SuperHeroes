// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'superheroes_secret_key';

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro.', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login.', error });
  }
});

export default router;
