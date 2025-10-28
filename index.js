// index.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const WEBHOOK_PATH = `/webhook/${TELEGRAM_TOKEN}`;

if (!TELEGRAM_TOKEN || !OPENAI_API_KEY) {
  console.error("❌ BOT_TOKEN या OPENAI_API_KEY missing है");
  process.exit(1);
}

const femaleNames = ["Aisha", "Riya", "Neha", "Sara", "Kavya", "Ananya", "Meera", "Priya", "Sana", "Diya"];
const regions = ["Delhi", "Mumbai", "Bangalore", "Jaipur", "Kolkata", "Lucknow", "Hyderabad"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function sendMessage(chat_id, text, extra = {}) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id, text, parse_mode: "Markdown", ...extra });
}

async function sendPhoto(chat_id, photoUrl, caption, extra = {}) {
  await axios.post(`${TELEGRAM_API}/sendPhoto`, { chat_id, photo: photoUrl, caption, parse_mode: "Markdown", ...extra });
}

async function generateGirlProfile() {
  const name = random(femaleNames);
  const region = random(regions);

  // 1️⃣ Generate short romantic intro
  const prompt = `Generate a romantic, cute, short Hindi introduction for a girl named ${name} from ${region}. Max 25 words.`;
  const chatRes = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You write short, sweet Hindi intros for fictional girls." },
        { role: "user", content: prompt }
      ],
      max_tokens: 50,
    },
    {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    }
  );

  const intro = chatRes.data.choices[0].message.content.trim();

  // 2️⃣ Generate girl photo using DALL·E
  const imagePrompt = `beautiful Indian girl portrait, smiling, ${region} style, soft lighting, ultra realistic`;
  const imageRes = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "512x512",
    },
    {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    }
  );

  const photoUrl = imageRes.data.data[0].url;

  return { name, region, intro, photoUrl };
}

// --- Telegram webhook handler ---
app.post(WEBHOOK_PATH, async (req, res) => {
  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = (update.message.text || "").toLowerCase();

    if (text === "/start") {
      const welcome = `हाय 💖 मैं *Mona* हूँ — तुम्हारी प्यारी AI दोस्त।\n\nक्या तुम लड़की से बात करना चाहते हो?`;
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "हाँ 💞", callback_data: "YES_GIRL" }],
            [{ text: "नहीं 🙈", callback_data: "NO_GIRL" }]
          ]
        }
      };
      await sendMessage(chatId, welcome, keyboard);
      return res.sendStatus(200);
    }

    await sendMessage(chatId, "अगर तुम लड़की से बात करना चाहते हो तो /start टाइप करो 💖");
    return res.sendStatus(200);
  }

  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;

    if (data === "NO_GIRL") {
      await sendMessage(chatId, "ठीक है 😊 मैं हमेशा यहाँ हूँ जब मन करे।");
      return res.sendStatus(200);
    }

    if (data === "YES_GIRL" || data === "ANOTHER_GIRL") {
      await sendMessage(chatId, "ज़रा रुको... मैं तुम्हारे लिए एक प्यारी लड़की ढूंढ रही हूँ 💞");

      const girl = await generateGirlProfile();
      const caption = `*नाम:* ${girl.name}\n*शहर:* ${girl.region}\n*परिचय:* ${girl.intro}`;
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "एक और दिखाओ 💘", callback_data: "ANOTHER_GIRL" }],
            [{ text: "बस, धन्यवाद 😊", callback_data: "NO_GIRL" }]
          ]
        }
      };
      await sendPhoto(chatId, girl.photoUrl, caption, keyboard);
      return res.sendStatus(200);
    }
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("Mona AI Match Bot is running 💖"));
app.listen(process.env.PORT || 10000, () => console.log("✅ Mona bot running"));
