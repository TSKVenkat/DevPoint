document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Firebase configuration (replace this with your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyDCNLhGx34vw-aOTgKjTHZbbCpvHsi73Mc",
  authDomain: "devpoint-a1fa4.firebaseapp.com",
  databaseURL: "https://devpoint-a1fa4-default-rtdb.firebaseio.com",
  projectId: "devpoint-a1fa4",
  storageBucket: "devpoint-a1fa4.appspot.com",
  messagingSenderId: "471801952491",
  appId: "1:471801952491:web:f776b75d39f29a8b5766ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Send message
sendButton.addEventListener('click', async (e) => {
  e.preventDefault()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;

      if (user) {
        const message = messageInput.value;
        if (message) {
          const messageElement = document.createElement('div');
          messageElement.innerHTML = `<div class="my-message"><img src="${user.photoURL}"><p>${message}</p></div>`;
          messagesContainer.appendChild(messageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

          async function fetchData(message) {
            try {
              const response = await fetch('https://devpoint-meta.onrender.com/api/data', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
              });

              if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
              }

              const data = await response.json();
              return data.content;
            } catch (error) {
              console.error("Error fetching data from backend:", error);
              return null;
            }
          }

          const response = await fetchData(message);
          const converter = new showdown.Converter();
          const htmlText = converter.makeHtml(response);

          const messageElement1 = document.createElement('div');
          messageElement1.innerHTML = `<div class="other-message"><img src="https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/e8dQ3HclyZY.png"><p>${htmlText}</p></div>`;
          messagesContainer.appendChild(messageElement1);
          messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

          messageInput.value = '';

        }
      } else{
        alert('user no authenticated')
        window.location.href='login.html';
      }
    })
});