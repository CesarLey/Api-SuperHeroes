import jwt from 'jsonwebtoken';

// Cambia esta clave por una más segura en producción
const JWT_SECRET = 'superheroes_secret_key';

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    // Extraer el token (quitar "Bearer del inicio)
    const token = authHeader.substring(7);

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adjuntar la información del usuario a la request
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(500).json({ message: 'Error en la autenticación' });
  }
};

export default authMiddleware; 