const fs = require("fs");
require("dotenv").config();
const { OpenAI } = require("openai");

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

async function generateReply(userMessage, scene = "gorone") {
  const scenePrompt = promptMap[scene] || "";
  const fullPrompt = `${basePrompt}\n${scenePrompt}`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: fullPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return res.choices[0].message.content;
}

module.exports = { generateReply };