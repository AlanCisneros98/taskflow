const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

module.exports = app;