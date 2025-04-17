const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const FIREBASE_URL = process.env.FIREBASE_URL;

function validateSignature(signature, body) {
  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-line-signature"];
  const body = JSON.stringify(req.body);

  if (!validateSignature(signature, body)) {
    return res.status(401).send("Invalid signature");
  }

  const events = req.body.events;
  events.forEach(async (event) => {
    if (event.type === "message" && event.message.type === "text") {
      const replyToken = event.replyToken;
      const userMessage = event.message.text.trim();

      if (userMessage === "查詢") {
        try {
          const fb = await axios.get(`${FIREBASE_URL}/status.json`);
          const current = fb.data || { room: "A", number: "未設定" };
          const replyMsg = `目前診間：${current.room}\n號碼：${current.number}`;

          await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            {
              replyToken: replyToken,
              messages: [{ type: "text", text: replyMsg }]
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
              }
            }
          );
        } catch (err) {
          console.error("Error replying:", err.message);
        }
      }
    }
  });

  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("LINE Webhook listening on port", port));