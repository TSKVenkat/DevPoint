document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Function to check if the email exists in the "users" node
async function checkUserEmailExists(email) {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (let userId in users) {
                if (users[userId].email === email) {
                    console.log("User exists:", users[userId]);
                    return true;
                }
            }
            console.log("User not found.");
            return false;
        } else {
            console.log("No users found.");
            return false;
        }
    } catch (error) {
        console.error("Error checking user email:", error);
        return false;
    }
}

// Google Sign-in and email check
document.getElementById("authbutton").addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;

            const exists = await checkUserEmailExists(user.email);
            if (exists) {
                // User exists, redirect to posts.html
                localStorage.setItem("photoURL", user.photoURL);
                localStorage.setItem("displayName", user.displayName);
                localStorage.setItem("email", user.email);
                window.location.href = "posts.html";
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
                    console.log("User information saved successfully:",);
                    window.location.href = "profile.html";
                } catch (error) {
                    console.error("Error saving user information:", error);
                }
            }
        })
        .catch((error) => {
            console.error("Error during sign-in:", error.code, error.message);
            alert("Sign-in failed: " + error.message);
        });
});