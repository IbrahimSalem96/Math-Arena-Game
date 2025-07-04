const amqp = require('amqplib');
const { register, login } = require('../services/auth.service');

async function startConsumer() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await conn.createChannel();
    const queue = 'auth_rpc';

    await channel.assertQueue(queue, { durable: false });
    console.log("[Auth Service] Waiting for messages...");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const { type, payload } = JSON.parse(msg.content.toString());
        let result;

        try {
          if (type === 'register') {
            result = await register(payload.name, payload.username, payload.password);
          } else if (type === 'login') {
            result = await login(payload.username, payload.password);
          } else {
            result = { error: 'Unknown request type' };
          }
        } catch (err) {
          result = { error: err.message };
        }

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(result)),
          {
            correlationId: msg.properties.correlationId
          }
        );

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("[RabbitMQ Error]", err.message);
  }
}


module.exports = startConsumer;
