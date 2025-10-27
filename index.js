import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Free Feature
app.get("/", (req, res) => {
  res.send("👋 Welcome to Mona Bot! Use /premium to unlock special features.");
});

// Premium Feature (unlocks with coins)
app.get("/premium", (req, res) => {
  const coins = 10;
  res.send(`🌟 Premium unlocked with ${coins} coins! Now you can view Riya's photos & videos!`);
});

// Watch Ad to Earn Coins
app.get("/watch-ad", (req, res) => {
  res.send("🎥 Thanks for watching the ad! You earned 0.50 coins!");
});

app.listen(PORT, () => {
  console.log(`🚀 Mona Bot running on port ${PORT}`);
});
