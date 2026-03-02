const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Health check — importante para Docker saber si el servicio está vivo
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`auth-service corriendo en puerto ${PORT}`);
});