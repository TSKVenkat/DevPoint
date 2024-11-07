document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

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

        const response = req(message);
        const converter = new showdown.Converter();
        const htmlText = converter.makeHtml(response);

        const messageElement1 = document.createElement('div');
        messageElement1.innerHTML = `<div class="other-message"><img src="https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/e8dQ3HclyZY.png"><p>${htmlText}</p></div>`;
        messagesContainer.appendChild(messageElement1);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

        messageInput.value = '';
    }
});

async function req(message){
    try {
        const response = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'content': message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);  // Success message

    } catch (error) {
        console.error('Fetch error:', error);
    }
}