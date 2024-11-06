const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add 'visible' class when element is in view
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
        // Optional: remove 'visible' class when element is out of view
        else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    // Options
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px' // No margin around the viewport
});

const d1 = document.querySelectorAll(".header");
const d2 = document.querySelectorAll(".info");
const d3 = document.querySelectorAll(".tag");
const d4 = document.querySelectorAll(".club");

d1.forEach(item => {
    observer.observe(item);
})

d2.forEach(item => {
    observer.observe(item);
})

d3.forEach(item => {
    observer.observe(item);
})

d4.forEach(item => {
    observer.observe(item);
})

/* document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
}); */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration (replace this with your own Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyCTUWEC7hhM0SY2IUM06KD9p473bNykKno",
    authDomain: "web-chat-7ff42.firebaseapp.com",
    projectId: "web-chat-7ff42",
    storageBucket: "web-chat-7ff42.appspot.com",
    messagingSenderId: "605843374216",
    appId: "1:605843374216:web:ed5d13ebab206431bedf3d",
    measurementId: "G-JJ9BLC1NYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const snapshot = await get(child(ref(db), "users"));
        if (snapshot.exists()) {
            const res = snapshot.val();
            for (let user in res) {
                console.log(res[user]);

                const messageElement = document.createElement('div');

                messageElement.innerHTML = `<div class="user-div">
                    <img src="${res[user].photoURL}">
                    <p class="username">${res[user].username}</p>
                    <p class="useremail">${res[user].email}</p>
                    <button class="viewbutton" data-user="${user}">View</button>
                </div>`;

                document.body.appendChild(messageElement);

                messageElement.querySelector(".viewbutton").addEventListener("click", (event) => {
                    const userId = event.target.getAttribute("data-user"); // Retrieve the user key
                    console.log("User key:", userId); // Log the corresponding record key
                    console.log("User data:", res[userId]); // Log the corresponding user data

                    // Populate the popup with user data
                    document.getElementById("img").src = res[userId].photoURL;
                    document.getElementById("name").textContent = res[userId].username;
                    document.getElementById("eid").textContent = res[userId].email;
                    document.getElementById("bio").textContent = res[userId].bio;

                    // Clear previous social media icons
                    const intlogoDiv = document.getElementById("intlogo");
                    intlogoDiv.innerHTML = ''; // Clear existing icons

                    // Define social media links
                    const socialMediaLinks = {
                        github: res[userId].git,
                        discord: res[userId].discord,
                        linkedin: res[userId].linkedin,
                        kaggle: res[userId].kaggle,
                        instagram: res[userId].instagram,
                        twitter: res[userId].twitter
                    };

                    // Loop through the social media links and create icons
                    for (let [id, url] of Object.entries(socialMediaLinks)) {
                        if (url) {
                            createSocialIcon(id, socialMediaIcons[id], url);
                        }
                    }

                    // Show popup
                    document.getElementById("popup").style.display = 'flex';
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
});

// Close popup event listener
document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popup").style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById("popup")) {
        document.getElementById("popup").style.display = 'none'; // Hide the pop-up
    }
});

// Function to create and append social media icons
function createSocialIcon(iconId, iconSrc, url) {
    const iconElement = document.createElement("div");
    iconElement.innerHTML = `<img id="${iconId}" src="${iconSrc}" width="25px" height="25px" style="opacity:1;cursor:pointer;">`;
    document.getElementById("intlogo").appendChild(iconElement);

    // Add click event to redirect to the URL
    iconElement.addEventListener("click", () => {
        window.open(url, '_blank'); // Open in a new tab
    });
}

// Define your social media icons here
const socialMediaIcons = {
    github: "https://github.com/fluidicon.png",
    discord: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico",
    linkedin: "https://cdn-icons-png.flaticon.com/128/3536/3536505.png",
    kaggle: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/189_Kaggle_logo_logos-512.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/1409/1409946.png",
    twitter: "https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
};
