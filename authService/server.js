require('dotenv').config({ path: __dirname + '/.env' });
const app = require('./app');
const startConsumer = require('./rabbitmq/consumer'); 

const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.MODE_ENV} mode on port ${PORT}`);
    startConsumer(); 
})
