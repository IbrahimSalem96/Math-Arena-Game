const amqp = require('amqplib');
const { getPlayerResult, getGameResult} = require('../services/result.service');

async function startConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'players_rpc';

  await channel.assertQueue(queue, { durable: false });
  console.log("[Players Service] Waiting for RPC calls...");

  channel.consume(queue, async (msg) => {
    const { type, payload } = JSON.parse(msg.content.toString());
    let result;

    try {
      if (type === 'player_result') {
        result = await getPlayerResult(payload.playerId);
      } else if (type === 'game_result') {
        result = await getGameResult(payload.gameId);
        console.log("✅ getGameResult returned:", result);
      } else {
        result = { error: 'Unknown request type' };
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
