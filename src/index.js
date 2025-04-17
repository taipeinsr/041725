require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text.trim();

      let replyMessage = '';

      switch (userMessage) {
        case '1':
          replyMessage = '📍 目前看診進度為：第 12 號病患，請 13 號至 1 號診間候診';
          break;
        case '2':
          replyMessage = '📝 請點選以下連結進行掛號：https://your-register-link.com';
          break;
        case '3':
          replyMessage = '🕒 本日看診時間為 08:30～12:00、14:00～17:30（中午休診）';
          break;
        default:
          replyMessage = '🙋 請輸入以下數字選擇服務：\n1️⃣ 查詢目前進度\n2️⃣ 我要掛號\n3️⃣ 看診時間';
      }

      await replyText(replyToken, replyMessage);
    }
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('LINE Webhook is running.');
});

app.listen(port, () => {
  console.log(`LINE webhook server is listening on port ${port}`);
});

async function replyText(replyToken, text) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [
        {
          type: 'text',
          text: text
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
      }
    });
  } catch (err) {
    console.error('❌ LINE 回覆訊息錯誤：', err.response?.data || err.message);
  }
}
