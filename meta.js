document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

import dotenv from './node_modules/dotenv/lib/main.js';
dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');

// Send message
sendButton.addEventListener('click', (e) => {
    e.preventDefault()
    const message = messageInput.value;
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<div class="my-message"><img src="${localStorage.getItem("photoURL")}"><p>${message}</p></div>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
        api(message);
        messageInput.value = '';
    }
});

// Replace <YOUR_API_KEY_HERE> with your actual API key
const apiKey = process.env.API;
const apiurl = 'https://api.groq.com/openai/v1/chat/completions';

async function api(message) {
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
    console.log(data.choices[0].message.content);

    const converter = new showdown.Converter();
    const htmlText = converter.makeHtml(data.choices[0].message.content);

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<div class="other-message"><img src="https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/e8dQ3HclyZY.png"><p>${htmlText}</p></div>`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
};