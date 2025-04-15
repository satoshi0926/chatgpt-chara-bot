const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");
const dotenv = require("dotenv");
const { generateReply } = require("./utils/gpt");

dotenv.config();

const app = express();

// ✅ 👇この直後に入れてOK！
app.use(express.json()) // JSONリクエストをパース

// ✅ ここに /gpt エンドポイント追加！
app.post("/gpt", async (req, res) => {
  const userText = req.body.message;
  try {
    const reply = await generateReply(userText);
    res.json({ reply });
  } catch (err) {
    console.error("GPTエラー:", err);
    res.status(500).json({
      reply: "えへへっ……ちょっと考えすぎちゃったかも〜💦",
    });
  }
});

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

app.post("/webhook", middleware(config), async (req, res) => {
  const events = req.body.events;
  const results = await Promise.all(
    events.map(async (event) => {
      if (event.type === "message" && event.message.type === "text") {
        const userText = event.message.text;

        try {
          const replyText = await generateReply(userText); // GPTから返答生成
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: replyText,
          });
        } catch (err) {
          console.error("GPTエラー:", err);
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: "えへへっ……ちょっと考えすぎちゃったかも〜💦",
          });
        }
      }
    })
  );
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE bot listening on port ${port}`);
});
