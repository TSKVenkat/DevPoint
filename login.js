document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMcMA6yY0E0bvrQxMtUUFw6otj7fhAalk",
  authDomain: "devpoint-a715e.firebaseapp.com",
  projectId: "devpoint-a715e",
  storageBucket: "devpoint-a715e.firebasestorage.app",
  messagingSenderId: "695340495283",
  appId: "1:695340495283:web:55ae38f54ebddc7b439bc6",
  measurementId: "G-68NZ9VHJX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Google Sign-in and email check
document.getElementById("authbutton").addEventListener("click", () => {
    const popupWindow = signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;

            if (user) {
                // Directly access the current user's data using their UID
                const userRef = child(ref(db), `users/${user.uid}`);
                try {
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        // User exists, redirect to posts.html
                        localStorage.setItem("photoURL", user.photoURL);
                        localStorage.setItem("displayName", user.displayName);
                        localStorage.setItem("email", user.email);

                        // Check if popup window is closed before redirecting
                        if (!popupWindow.closed) {
                            window.location.href = "posts.html";
                        }
                    }
                } catch (error) { 
                    console.error(error); 
                }
            } else {
                try {
                    await set(ref(db, `users/${user.uid}`), {
                        username: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        bio: '',
                        git: '',
                        linkedin: '',
                        discord: '',
                        instagram: '',
                        twitter: '',
                        kaggle: ''
                    });
                    localStorage.setItem("photoURL", user.photoURL);
                    localStorage.setItem("displayName", user.displayName);
                    localStorage.setItem("email", user.email);
                    console.log("User information saved successfully");

                    // Check if popup window is closed before redirecting
                    if (!popupWindow.closed) {
                        window.location.href = "profile.html";
                    }
                } catch (error) {
                    console.error("Error saving user information:", error);
                }
            }
        })
        .catch((error) => {
            console.error("Error during sign-in:", error.code, error.message);
            alert("Sign-in failed: " + error.message);
        });

    // Check every 500ms if the popup window has been closed
    const checkPopupClosed = setInterval(() => {
        if (popupWindow.closed) {
            clearInterval(checkPopupClosed);
            alert("The authentication window was closed. Please try signing in again.");
        }
    }, 3000);
});
