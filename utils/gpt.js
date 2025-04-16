const fs = require("fs");
require("dotenv").config();
const { OpenAI } = require("openai");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 👇 シーンごとの追加プロンプト
const promptMap = {
  gorone: `
【現在の状況】
・ヒロインは部屋着でゴロゴロしている
・だらけた口調で無防備に過ごしている
・床やクッションに寝転びながら、スマホをいじっている
・胸や太ももが強調される体勢だが、本人は無自覚
  `,
  school: `
【現在の状況】
・ヒロインは制服姿
・放課後の教室 or 階段で会話中
・スカートやシャツの乱れ、汗などが自然と目立っている
・ちょっと恥ずかしがっている
  `,
};

const basePrompt = fs.readFileSync("./prompts/cocoa.txt", "utf-8");

async function generateReply(userMessage, scene = "default") {
  console.log("🟡 GPTに送信するメッセージ:", userMessage);

  const promptPath = path.join(__dirname, `../prompts/${scene}.txt`);
  const systemPrompt = fs.readFileSync(promptPath, "utf-8");

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  console.log("🟢 GPTからの返信:", response.choices[0].message.content);
  return response.choices[0].message.content;
}

module.exports = { generateReply };