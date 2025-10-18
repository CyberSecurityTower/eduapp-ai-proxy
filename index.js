const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("API Key not found. Please add GOOGLE_API_KEY to environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const botReply = response.text();
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
