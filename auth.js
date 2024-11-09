document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Set session persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        return signInWithPopup(auth, provider);
    })
    .catch((error) => {
        console.error('Error setting persistence:', error.message);
    });


// Function to save user info to the Realtime Database
async function saveUserToDatabase(uid, email, displayName, photoURL) {
    try {
        await set(ref(db, `users/${uid}`), {
            username: displayName,
            email,
            photoURL,
            bio: '',
            git: '',
            linkedin: '',
            discord: '',
            instagram: '',
            twitter: '',
            kaggle: ''
        });
        console.log("User information saved successfully:", );
        window.location.href = "profile.html";
    } catch (error) {
        console.error("Error saving user information:", error);
    }
}

// Google Sign-up
document.getElementById("authbutton").addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            const { uid, email, displayName, photoURL } = user;
            console.log("User signed up successfully:", { uid, email, displayName, photoURL });

            // Save user data to Realtime Database under "users/" node
            await saveUserToDatabase(uid, email, displayName, photoURL);
        })
        .catch((error) => {
            console.error("Error during sign-up:", error.code, error.message);
            alert("Sign-up failed: " + error.message);
        });
});
