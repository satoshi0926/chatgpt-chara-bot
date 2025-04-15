const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let prompt = "";

try {
  prompt = fs.readFileSync("./prompts/cocoa.txt", "utf-8");
  console.log("✅ プロンプト読み込み成功");
} catch (err) {
  console.error("❌ プロンプト読み込み失敗:", err);
}

async function generateReply(userMessage) {
  console.log("🟡 GPTに送信するメッセージ:", userMessage);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
    ],
  });

  console.log("🟢 GPTからの返信:", res.choices[0].message.content);
  return response.choices[0].message.content;
}

module.exports = { generateReply };