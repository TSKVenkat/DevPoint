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

document.getElementById("authbutton").addEventListener("click", () => {
    signInWithRedirect(auth, provider);
});

// After redirect, handle the sign-in result
getRedirectResult(auth)
    .then(async (result) => {
        if (result) {
            const user = result.user;

            if (user) {
                const userRef = child(ref(db), `users/${user.uid}`);
                try {
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        // User exists, redirect to posts.html
                        localStorage.setItem("photoURL", user.photoURL);
                        localStorage.setItem("displayName", user.displayName);
                        localStorage.setItem("email", user.email);
                        window.location.href = "posts.html";
                    } else {
                        // New user, create a record in the database
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
                        window.location.href = "profile.html";
                    }
                } catch (error) {
                    console.error("Error accessing user data:", error);
                }
            }
        }
    })
    .catch((error) => {
        console.error("Error during sign-in redirect:", error.code, error.message);
        alert("Sign-in failed: " + error.message);
    });
