const express = require('express');
const amqp = require('amqplib');
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

async function connectWithRetry(url, retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(url);
      console.log('✅ Conectado a RabbitMQ');
      return connection;
    } catch (err) {
      console.log(`⏳ RabbitMQ no disponible, reintentando en ${delay/1000}s... (${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('No se pudo conectar a RabbitMQ después de varios intentos');
}

async function startConsumer() {
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
  const EXCHANGE = 'taskflow.events';

  const connection = await connectWithRetry(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Declarar el mismo exchange que usa tasks-service
  await channel.assertExchange(EXCHANGE, 'fanout', { durable: true });

  // Cola exclusiva — RabbitMQ le asigna un nombre único automáticamente
  const { queue } = await channel.assertQueue('', { exclusive: true });

  // Bindear la cola al exchange
  await channel.bindQueue(queue, EXCHANGE, '');

  console.log('👂 Escuchando eventos de tareas...');

  channel.consume(queue, (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());
    console.log(`📨 Evento recibido: ${event.Event}`);

    if (event.Event === 'task.created') {
      // En un sistema real aquí enviarías un email
      console.log(`📧 [SIMULADO] Email enviado al usuario ${event.UserId}:`);
      console.log(`   "Tu tarea '${event.Title}' fue creada exitosamente (ID: ${event.TaskId})"`);
    }

    channel.ack(msg);
  });
}

// Arrancar el consumidor
startConsumer().catch(err => {
  console.error('Error en el consumidor de RabbitMQ:', err);
  process.exit(1);
});