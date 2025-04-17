require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const replyFlexMessage = async (replyToken, flexContent) => {
  await axios.post(
    'https://api.line.me/v2/bot/message/reply',
    {
      replyToken: replyToken,
      messages: [flexContent]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    }
  );
};

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      if (userMessage === '1') {
        // 模擬看診進度 Flex
        await replyFlexMessage(replyToken, {
          type: 'flex',
          altText: '目前看診進度',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '🔍 目前看診進度',
                  weight: 'bold',
                  size: 'lg'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              contents: [
                {
                  type: 'text',
                  text: '第 12 號病患，請 13 號至 1 號診間候診',
                  wrap: true,
                  size: 'md'
                }
              ]
            }
          }
        });

      } else if (userMessage === '2') {
        // 模擬掛號連結 Flex
        await replyFlexMessage(replyToken, {
          type: 'flex',
          altText: '掛號連結',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '請點選以下連結掛號',
                  weight: 'bold',
                  size: 'lg',
                  margin: 'md'
                },
                {
                  type: 'text',
                  text: 'https://your-register-link.com',
                  size: 'sm',
                  color: '#007AFF',
                  margin: 'md'
                }
              ]
            }
          }
        });

      } else if (userMessage === '3') {
        // 固定看診時間 Flex
        await replyFlexMessage(replyToken, {
          type: 'flex',
          altText: '今日看診時間',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '📅 今日看診時間',
                  weight: 'bold',
                  size: 'lg'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '上午門診：08:30 ~ 12:00',
                      size: 'md',
                      flex: 1
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '午休時間：12:00 ~ 14:00',
                      size: 'md',
                      flex: 1
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '下午門診：14:00 ~ 17:30',
                      size: 'md',
                      flex: 1
                    }
                  ]
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '💖 感謝您的來訊，祝您健康平安！',
                  size: 'sm',
                  color: '#AAAAAA',
                  align: 'center'
                }
              ]
            }
          }
        });

      } else {
        // 其他訊息預設回應
        await replyFlexMessage(replyToken, {
          type: 'text',
          text: '請輸入：\n1 - 查詢目前看診進度\n2 - 我要掛號\n3 - 看診時間'
        });
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
