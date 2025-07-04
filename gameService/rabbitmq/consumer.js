const amqp = require('amqplib');
const { startGame, submitAnswer, joinGame, endGame } = require('../services/game.service');

async function startConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'game_rpc';

  await channel.assertQueue(queue, { durable: false });
  console.log("[Game Service] Waiting for RPC calls...");

  channel.consume(queue, async (msg) => {
    const { type, payload } = JSON.parse(msg.content.toString());
    let result;

    console.log("📥 Received in consumer:", { type, payload });

    try {
      if (type === 'start') {
        result = await startGame(payload.name, payload.difficulty);
      } else if (type === 'submit') {
        // result = await submitAnswer(payload.gameId, payload.answer);
        result = await submitAnswer(payload.playerId, payload.answer);
      } else if (type === 'join') {
        result = await joinGame(payload.gameId, payload.name);
      } else if (type === 'end') {
        result = await endGame(payload.gameId);
      } else {
        result = { error: 'Unknown game request' };
      }
    } catch (err) {
      result = { error: err.message };
    }

    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
      correlationId: msg.properties.correlationId
    });

    channel.ack(msg);
  });
}


module.exports = startConsumer;
