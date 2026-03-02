const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notifications-service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`notifications-service corriendo en puerto ${PORT}`);
});