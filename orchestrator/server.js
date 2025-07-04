require('dotenv').config({ path: __dirname + '/.env' });
const app = require('./app');

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Orchestrator running on port ${PORT}`);
});
