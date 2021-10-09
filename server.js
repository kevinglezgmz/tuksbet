const express = require('express');
const app = express();
const dotenv = require('dotenv');
const config = dotenv.config();

const mainRouter = require('./src/routes');

const PORT = process.env.PORT || 3000;

app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log('Server listening on port:', PORT, 'http://localhost:' + PORT);
});
