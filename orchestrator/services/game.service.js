const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function sendToGameQueue(payload, type) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'game_rpc';
  const correlationId = uuidv4();
  const replyQueue = await channel.assertQueue('', { exclusive: true });

  return new Promise((resolve, reject) => {
    channel.consume(replyQueue.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        try {
          const response = JSON.parse(msg.content.toString());
          resolve(response);
        } catch (err) {
          reject({ error: 'Invalid JSON response' });
        } finally {
          conn.close();
        }
      }
    }, { noAck: true });

    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ type, payload })),
      {
        correlationId,
        replyTo: replyQueue.queue
      }
    );
  });
}


module.exports = {
  /**-------------------------------------------------------------
   * @desc    Start Game
   * @route   /game/start
   * @method  POST
   * @access  private ( Token )
  ---------------------------------------------------------------*/
  startGame: async (req, res) => {
    const { name, difficulty } = req.body;

    if (!name || !difficulty) {
      return res.status(400).json({ error: "Missing name or difficulty" });
    }

    const response = await sendToGameQueue({ name, difficulty }, 'start');
    res.json(response);
  },

  /**-------------------------------------------------------------
   * @desc    End Game
   * @route   /game/:playerId/submit
   * @method  POST
   * @access  private ( Token )
  ---------------------------------------------------------------*/
  submitAnswer: async (req, res) => {
    const { playerId } = req.params;
    const { answer } = req.body;

    if (!answer || isNaN(answer)) {
      return res.status(400).json({ error: "Invalid or missing answer" });
    }

    const response = await sendToGameQueue({ playerId, answer }, 'submit');
    res.json(response);
  },

  /**-------------------------------------------------------------
   * @desc    Join Game
   * @route   /game/:gameId/join
   * @method  PUT
   * @access  private ( Token )
  ---------------------------------------------------------------*/
  joinGame: async (req, res) => {
    const { gameId } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Missing player name" });

    const response = await sendToGameQueue({ gameId, name }, 'join');
    res.json(response);
  },

  /**-------------------------------------------------------------
   * @desc    End Game
   * @route   /game/:gameId/end
   * @method  GET
   * @access  private ( Token )
  ---------------------------------------------------------------*/
  endGame: async (req, res) => {
    const { gameId } = req.params;

    const response = await sendToGameQueue({ gameId }, 'end');
    res.json(response);
  }
};
