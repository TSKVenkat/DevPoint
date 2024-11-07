import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const externalApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
const apiKey = process.env.API_KEY;  // Store your API key in a .env file

// Endpoint to handle POST requests from the frontend
app.post('/api/data', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error in external API call:", error);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
