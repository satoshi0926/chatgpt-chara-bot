const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ← .envにこのキーが必要！
});
const openai = new OpenAIApi(configuration);

// キャラ設定（cocoa.txt）を事前に読み込んで保持
const characterPrompt = fs.readFileSync("./prompts/cocoa.txt", "utf8");

async function generateReply(userMessage) {
  const messages = [
    {
      role: "system",
      content: characterPrompt,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", // GPT-4にするなら "gpt-4"
    messages,
    temperature: 0.9, // キャラの感情を少し出す
    max_tokens: 120,
  });

  return completion.data.choices[0].message.content.trim();
}

module.exports = { generateReply };