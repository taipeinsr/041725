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

      switch (userMessage) {
        case '1':
          await replyFlex(replyToken, '看診進度查詢', {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                { type: 'text', text: '📍 看診進度', weight: 'bold', size: 'lg' },
                { type: 'separator', margin: 'md' },
                { type: 'text', text: '診間一：第 12 號\n診間二：第 9 號', margin: 'md', size: 'md' },
                { type: 'text', text: '請第 13 號病患準備', margin: 'sm', size: 'sm', color: '#888888' }
              ]
            }
          });
          break;

        case '2':
          await replyFlex(replyToken, '掛號入口', {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                { type: 'text', text: '📝 我要掛號', weight: 'bold', size: 'lg' },
                { type: 'text', text: '請點選下方按鈕前往掛號系統：', margin: 'md', size: 'md' }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '前往掛號',
                    uri: 'https://your-register-link.com'
                  },
                  style: 'primary'
                }
              ]
            }
          });
          break;

        case '3':
          await replyFlex(replyToken, '今日看診時間', {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://i.imgur.com/6PhGv9p.png',
              size: 'full',
              aspectRatio: '20:6',
              aspectMode: 'cover'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              contents: [
                { type: 'text', text: '📅 今日看診時間', weight: 'bold', size: 'lg' },
                { type: 'separator' },
                { type: 'text', text: '🕘 上午門診：08:30 ~ 12:00', size: 'md' },
                { type: 'text', text: '☕ 午休時間：12:00 ~ 14:00', size: 'md' },
                { type: 'text', text: '🕑 下午門診：14:00 ~ 17:30', size: 'md' },
                { type: 'separator' },
                { type: 'text', text: '🏥 感謝您的來訊，祝您健康平安！', size: 'sm', wrap: true, color: '#888888' }
              ]
            }
          });
          break;

        default:
          await replyText(replyToken,
            '🙋 請輸入以下數字選擇服務：\n1️⃣ 查詢目前進度\n2️⃣ 我要掛號\n3️⃣ 看診時間'
          );
      }
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
      messages: [{ type: 'text', text }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
      }
    });
  } catch (err) {
    console.error('❌ 回覆文字訊息失敗：', err.response?.data || err.message);
  }
}

async function replyFlex(replyToken, altText, contents) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [{ type: 'flex', altText, contents }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
      }
    });
  } catch (err) {
    console.error('❌ 回覆 Flex Message 失敗：', err.response?.data || err.message);
  }
}
