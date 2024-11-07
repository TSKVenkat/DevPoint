import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;  // Use PORT from .env or default to 3000

const allowedOrigins = ['https://devpointsnuc.vercel.app', 'http://localhost:5500','http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Replace <YOUR_API_KEY_HERE> with your actual API key
const apiKey = process.env.API;
const apiurl = 'https://api.groq.com/openai/v1/chat/completions';

app.post('/api-post', async function api(message) {
  const res = await fetch(apiurl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(
      {
        "model": "llama3-8b-8192",
        "messages": [{
          role: "user",
          content: `${message}`
        }]
      }
    )
  })
  const data = await res.json();
  console.log(data);
  return data.choices[0].message.content;
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});