require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

// Webhookの受信
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

// メッセージを受け取ってオウム返しするだけ
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `ここあ「${event.message.text}」って言ったね♪`,
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE bot listening on port ${port}`);
});
