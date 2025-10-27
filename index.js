import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = 
`https://mona-bot.onrender.com${URI}`;

// Telegram webhook set
app.post(URI, async (req, res) => {
  const chatId = req.body.message.chat.id;
  const text = req.body.message.text;

  console.log("Message received:", text);

  let reply = "Hi 😊 I’m Mona! How are you?";
  if (/hello|hi/i.test(text)) reply = "Hello ❤️ Mona yahan hai, kaise ho?";
  else if (/kya kar rahi ho/i.test(text)) reply = "Bas aapse baat kar rahi ho 💬";
  else if (/bye/i.test(text)) reply = "Bye bye 👋 fir milte hai!";
  else reply = "Hmm... ye interesting hai 😄 aur batao?";

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: reply,
  });

  return res.send();
});

// Home route
app.get("/", (req, res) => res.send("Mona Bot is live 💖"));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
  console.log(`Mona running on port ${PORT}`);
});
