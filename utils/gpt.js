const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = fs.readFileSync("./prompts/cocoa.txt", "utf-8");

async function generateReply(userText) {
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