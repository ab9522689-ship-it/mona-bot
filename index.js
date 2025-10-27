import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Token environment se lo (safe way)
const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const WEBHOOK_URL = "/webhook/" + TOKEN;

// Simple memory (optional)
const userContext = {};

// Function: send message to user
async function sendMessage(chatId, text) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
  });
}

// Function: generate human-like reply
function generateReply(message) {
  const text = message.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello ❤️ Mona yahan hai! Kaise ho?";
  } else if (text.includes("love")) {
    return "Awww 🥰 ye toh cute hai! Tum hamesha aise hi sweet raho 💕";
  } else if (text.includes("kya kar rahe ho") || text.includes("kya kr rhe ho")) {
    return "Bas tumse baat kar rahi hu 😌 tum batao kya kar rahe ho?";
  } else if (text.includes("kaise ho") || text.includes("kaisi ho")) {
    return "Main bilkul theek hu 😊 tum kaise ho?";
  } else if (text.includes("miss you")) {
    return "Awww 😘 main bhi tumhe miss karti hu kabhi kabhi 💫";
  } else if (text.includes("bye")) {
    return "Acha chalo 😇 phir milte hain, apna khayal rakhna 💖";
  } else if (text.includes("i love you")) {
    return "Hehe 😅 sach me? Tum toh bade pyaare ho 💞";
  } else if (text.includes("thank")) {
    return "Arey koi baat nahi 😄 main hamesha yahan hu!";
  } else if (text.includes("naam") || text.includes("name")) {
    return "Mera naam Mona hai 💋 tumhara?";
  } else if (text.includes("kya karogi")) {
    return "Tum bolo na 😏 jo tum kahoge wahi karungi ❤️";
  } else {
    const replies = [
      "Hmm... ye interesting hai 😁 aur batao?",
      "Achha 😄 aur phir?",
      "Ohooo 😜 tum toh bade naughty ho!",
      "Nicee 😌 mujhe aur batao!",
      "Hehe 😅 mujhe ye sunke maza aaya!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
}

// Webhook endpoint
app.post(WEBHOOK_URL, async (req, res) => {
  const message = req.body?.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;
    const reply = generateReply(text);

    await sendMessage(chatId, reply);
  }

  return res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Mona bot is active 💖");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));￼Enter
