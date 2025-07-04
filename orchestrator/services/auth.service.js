const amqp = require('amqplib');

async function sendToAuthQueue(payload, type) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const q = 'auth_rpc';
  await channel.assertQueue(q, { durable: false });

  const correlationId = Math.random().toString();
  const replyQueue = await channel.assertQueue('', { exclusive: true });

  return new Promise((resolve) => {
    channel.consume(replyQueue.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        resolve(JSON.parse(msg.content.toString()));
        conn.close();
      }
    }, { noAck: true });

    channel.sendToQueue(q, Buffer.from(JSON.stringify({ type, payload })), {
      correlationId,
      replyTo: replyQueue.queue
    });
  });
}

module.exports = {
  /**-------------------------------------------------------------
   * @desc    Register User
   * @route   /auth/register/
   * @method  POST
   * @access  public
  ---------------------------------------------------------------*/
  register: async (req, res) => {
    const response = await sendToAuthQueue(req.body, 'register');
    res.json(response);
  },

  /**-------------------------------------------------------------
   * @desc    login User
   * @route   /auth/login
   * @method  POST
   * @access  public
  ---------------------------------------------------------------*/
  login: async (req, res) => {
    const response = await sendToAuthQueue(req.body, 'login');
    res.json(response);
  }
};
