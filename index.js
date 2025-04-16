const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");
const cors = require("cors")
const dotenv = require("dotenv");
const { generateReply } = require("./utils/gpt");

dotenv.config();

const app = express();
app.use(cors())
// ✅ 👇この直後に入れてOK！
app.use(express.json()) // JSONリクエストをパース

// ✅ ここに /gpt エンドポイント追加！
app.post("/gpt", async (req, res) => {
  const { message, scene } = req.body;
  console.log("🟢 /gptリクエスト:", message, "scene:", scene);

  try {
    const reply = await generateReply(message, scene);
    res.json({ reply });
    console.log("🟢 GPTに渡すscene:", scene);
  } catch (err) {
    console.error("GPTエラー:", err);
    res.status(500).json({ reply: "えへへっ……ちょっと考えすぎちゃったかも〜💦" });
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
          console.log("🟢 GPTからの返答:", replyText);
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

const { getLinesByTagOrScene } = require("./getLines");

app.post("/line-db", async (req, res) => {
  const { tag, scene } = req.body;
  try {
    const line = await getLinesByTagOrScene(tag, scene);
    res.json({ reply: line });
  } catch (err) {
    console.error("セリフ取得エラー:", err);
    res.status(500).json({ reply: "セリフが見つかりませんでした💦" });
  }
});
