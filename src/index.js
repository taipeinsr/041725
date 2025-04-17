const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  if (!events || events.length === 0) return res.sendStatus(200);

  for (const event of events) {
    const replyToken = event.replyToken;
    const userMessage = event.message?.text;

    let replyMessage;

    if (userMessage === '1') {
      replyMessage = {
        type: 'flex',
        altText: '目前看診進度',
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'text',
              text: '目前看診進度',
              weight: 'bold',
              size: 'lg'
            }]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'text',
              text: '第 12 號病患，請 13 號至 1 號診間候診',
              size: 'md',
              color: '#555555'
            }]
          }
        }
      };
    } else if (userMessage === '2') {
      replyMessage = {
        type: 'flex',
        altText: '我要掛號',
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'text',
              text: '我要掛號',
              weight: 'bold',
              size: 'lg'
            }]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'text',
              text: '請點選下方連結進行掛號：',
              wrap: true
            }, {
              type: 'button',
              action: {
                type: 'uri',
                label: '前往掛號系統',
                uri: 'https://your-register-link.com'
              },
              style: 'primary',
              color: '#28a745',
              margin: 'md'
            }]
          }
        }
      };
    } else if (userMessage === '3') {
      replyMessage = {
        type: 'flex',
        altText: '今日看診時間',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://i.imgur.com/ErscfRQ.png', // 穩定圖片
            size: 'full',
            aspectRatio: '20:6',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🗓️ 今日看診時間',
                weight: 'bold',
                size: 'lg',
                margin: 'md'
              },
              {
                type: 'separator',
                margin: 'md'
              },
              {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                margin: 'md',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      { type: 'text', text: '🕗 上午門診：', flex: 2 },
                      { type: 'text', text: '08:30 ~ 12:00', flex: 3 }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      { type: 'text', text: '🍵 午休時間：', flex: 2 },
                      { type: 'text', text: '12:00 ~ 14:00', flex: 3 }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      { type: 'text', text: '🕓 下午門診：', flex: 2 },
                      { type: 'text', text: '14:00 ~ 17:30', flex: 3 }
                    ]
                  }
                ]
              },
              {
                type: 'text',
                text: '💬 感謝您的來訊，祝您健康平安！',
                size: 'xs',
                color: '#aaaaaa',
                wrap: true,
                margin: 'lg'
              }
            ]
          }
        }
      };
    } else {
      replyMessage = {
        type: 'text',
        text: '請輸入數字：\n1️⃣ 查詢目前看診進度\n2️⃣ 我要掛號\n3️⃣ 今日看診時間'
      };
    }

    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [replyMessage]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {你的 LINE Channel Access Token}`
      }
    });
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('LINE Webhook is running.');
});

app.listen(port, () => {
  console.log(`LINE webhook server is listening on port ${port}`);
});
