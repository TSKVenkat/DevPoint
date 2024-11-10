document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const socialMediaIcons = {
    github: "https://github.com/fluidicon.png",
    discord: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico",
    linkedin: "https://cdn-icons-png.flaticon.com/128/3536/3536505.png",
    kaggle: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/189_Kaggle_logo_logos-512.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/1409/1409946.png",
    twitter: "https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
};

// Helper function to create and append social icons based on input values
function createSocialIcon(iconId, iconSrc, inputId) {
    const iconElement = document.createElement("a");
    iconElement.href = document.getElementById(inputId)?.value || "#";
    iconElement.target = "_blank"; // Opens in new tab if URL exists
    iconElement.innerHTML = `<img id="${iconId}" src="${iconSrc}" width="25px" height="25px" style="cursor:pointer;">`;
    document.getElementById("intlogo").appendChild(iconElement);
}

function safeSetValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    } else {
        console.warn(`Element with ID '${id}' not found. Skipping.`);
    }
}


async function displayUserData() {
    try {
        const user = auth.currentUser;

        if (user) {
            // Directly access the current user's data using their UID
            const userRef = child(ref(db), `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Set user info in the HTML
                document.getElementById("bio").textContent = userData.bio || "";
                document.getElementById("msg").value = userData.bio || "";
                document.getElementById("name").textContent = user.displayName || "No Name";
                document.getElementById("email").textContent = user.email || "No Email";
                document.getElementById("uname").value = user.email || "snuc@gmail.com";
                document.getElementById("uemail").value = user.displayName || "No Name";
                document.getElementById("pfp").src = user.photoURL || "default-profile.png";

                // Clear previous icons and add new ones based on URLs
                document.getElementById("intlogo").innerHTML = "";

                // Populate social media icons
                const socialMediaLinks = {
                    github: userData.git,
                    discord: userData.discord,
                    linkedin: userData.linkedin,
                    kaggle: userData.kaggle,
                    instagram: userData.instagram,
                    twitter: userData.twitter
                };

                for (let [id, url] of Object.entries(socialMediaLinks)) {
                    if (url) {
                        const inputId = `${id}-input`;
                        safeSetValue(inputId, url); // Use safeSetValue to avoid null errors
                        createSocialIcon(id, socialMediaIcons[id], inputId);
                    }
                }

            } else {
                console.log("No data available for this user");
            }
        } else {
            console.log("User not authenticated");
        }

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}


// Update user profile when clicking 'Update'
document.getElementById("button").addEventListener("click", async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        // Access the current user's data directly by their UID
        const userId = user.uid;
        const postData = {
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            bio: document.getElementById("msg").value,
            git: document.getElementById("github-input").value || "",
            linkedin: document.getElementById("linkedin-input").value || "",
            discord: document.getElementById("discord-input").value || "",
            instagram: document.getElementById("instagram-input").value || "",
            twitter: document.getElementById("twitter-input").value || "",
            kaggle: document.getElementById("kaggle-input").value || ""
        };

        // Update the user's profile data
        await update(ref(db, `users/${userId}`), postData);
        console.log("Profile updated successfully");

        // Refresh icons or user data
        displayUserData(user);

    } catch (error) {
        console.error("Error updating profile:", error);
    }
});

// Authentication and persistence setup
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayUserData(user);
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("photoURL", user.photoURL);
    } else {
        alert("No user signed in! Redirecting to authentication page.");
        window.location.href = "auth.html";
    }
});

setPersistence(auth, browserLocalPersistence)
    .then(() => signInWithPopup(auth, provider))
    .catch((error) => console.error('Sign-in error:', error.message));

document.getElementById("nxtbutton").addEventListener("click", () => {
    window.location.href = "posts.html";
})