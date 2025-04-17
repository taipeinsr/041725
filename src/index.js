require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('Received event from LINE:', req.body.events);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('LINE Webhook is running.');
});

app.listen(port, () => {
  console.log(`LINE webhook server is listening on port ${port}`);
});
