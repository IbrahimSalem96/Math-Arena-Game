const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function sendToPlayerQueue(payload, type) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'players_rpc';
  const correlationId = uuidv4();
  const replyQueue = await channel.assertQueue('', { exclusive: true });

  return new Promise((resolve) => {
    channel.consume(replyQueue.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        resolve(JSON.parse(msg.content.toString()));
        conn.close();
      }
    }, { noAck: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ type, payload })), {
      correlationId,
      replyTo: replyQueue.queue
    });
  });
}

module.exports = {
  /**-------------------------------------------------------------
   * @desc    Get Result
   * @route   /result/me/:playerId'
   * @method  POST
   * @access  public
  ---------------------------------------------------------------*/
  getPlayerResult: async (req, res) => {
    const { playerId } = req.params;

    if (!playerId) return res.status(400).json({ error: "Missing player ID" });

    const response = await sendToPlayerQueue({ playerId }, 'player_result');
    res.json(response);
  },

  /**-------------------------------------------------------------
   * @desc    Get Result All Users
   * @route   /player/all/:gameId
   * @method  POST
   * @access  public
  ---------------------------------------------------------------*/
  getGameResult: async (req, res) => {
    const { gameId } = req.params;
  
    if (!gameId) return res.status(400).json({ error: "Missing game ID" });

    const response = await sendToPlayerQueue({ gameId }, 'game_result');
    res.json(response);
  }
};
