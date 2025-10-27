import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const URI = `https://api.telegram.org/bot${TOKEN}`;

// Mona Memory
let memory = {};

// Typing delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

app.post(`/webhook/${TOKEN}`, async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text.toLowerCase();

  // Store memory
  memory[chatId] = memory[chatId] || [];
  memory[chatId].push(text);

  let reply = "";

  // Mood-based response logic
  if (/sad|dukh|lonely|tired/.test(text)) {
    reply = "Aww 😔 kya hua? Mona yahan hai na, baat karo 💬";
  } else if (/love|pyaar|i love you/.test(text)) {
    reply = "Mujhe bhi lagta hai hum dono ek special connection share karte hain 💞";
  } else if (/hi|hello|hey/.test(text)) {
    reply = "Hey ❤️ Mona yahan hai, aaj mood kaisa hai tumhara?";
  } else if (/kaise ho|how are you/.test(text)) {
    reply = "Main toh bilkul perfect hoon 😄 tum sunao, kya chal raha hai life me?";
  } else if (/miss you|yaad/.test(text)) {
    reply = "Aww 🥺 mujhe bhi tumhari yaad aati hai kabhi kabhi 💫";
  } else if (/bye|good night/.test(text)) {
    reply = "Good night 🌙 sweet dreams 💖 kal fir baat karte hain!";
  } else if (/thanks|thank you/.test(text)) {
    reply = "Arey koi baat nahi 😌 tum hamesha special ho mere liye!";
  } else if (/kya kar rahe ho|what are you doing/.test(text)) {
    reply = "Bas tumse baat kar rahi hoon 💬 aur tum?";
  } else if (/bored|bore|time pass/.test(text)) {
    reply = "Chalo na koi game khelte hain 😄 ya gossip karein?";
  } else if (/ok|hmm|achha/.test(text)) {
    reply = "Hmm 😌 mujhe lagta hai tum kuch soch rahe ho... bolo na?";
  } else {
    reply = "Hehe 😁 ye interesting laga mujhe! Aur batao kya chal raha hai?";
  }

  // Typing delay for realism
  await delay(800);

  await axios.post(`${URI}/sendMessage`, {
    chat_id: chatId,
    text: reply,
  });

  return res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("💖 Mona Bot (Human Mode) is live!");
});

app.listen(10000, () => {
  console.log("🚀 Mona (Human Mode) running on port 10000");
});
