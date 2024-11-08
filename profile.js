/* document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
}); */

/* import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTUWEC7hhM0SY2IUM06KD9p473bNykKno",
    authDomain: "web-chat-7ff42.firebaseapp.com",
    projectId: "web-chat-7ff42",
    storageBucket: "web-chat-7ff42.appspot.com",
    messagingSenderId: "605843374216",
    appId: "1:605843374216:web:ed5d13ebab206431bedf3d",
    measurementId: "G-JJ9BLC1NYG"
};

const discord = "https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png";
const instagram = "https://static.cdninstagram.com/rsrc.php/v3/yG/r/De-Dwpd5CHc.png";
const linkedin = "https://cdn-icons-png.flaticon.com/128/3536/3536505.png";
const github = "https://github.com/fluidicon.png";
const kaggle = "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/189_Kaggle_logo_logos-512.png";
const twitter = "https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Check if user is signed in
onAuthStateChanged(auth, async (user) => {
    if (user) {

        const snapshot = await get(child(ref(db), "users"));

        if (snapshot.exists()) {
            const res = snapshot.val();
            for (let uid in res) {
                console.log(res);
                if (localStorage.getItem("email") === res[uid].email) {
                    console.log(res[uid].bio)
                    document.getElementById("bio").textContent = res[uid].bio;
                    document.getElementById("msg").value = res[uid].bio;
                    if (res[uid].git) {
                        const git = res[uid].git;
                        console.log(git)
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="github" src="https://github.com/fluidicon.png" width="30px" height="30px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("github").style.opacity = '1';
                        document.getElementById("git").value = git || "";
                        document.getElementById("github").addEventListener("click", () => {
                            window.location.href = document.getElementById("git").value;
                        })
                    }
                    if (document.getElementById("discord") && res[uid].discord) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="discord"
                    src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico"
                    width="25px" height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("discord").style.opacity = '1';
                        document.getElementById("discord-input").value = res[uid].discord || "";
                        document.getElementById("discord").addEventListener("click", () => {
                            window.location.href = document.getElementById("discord-input").value;
                        })
                    }
                    if (document.getElementById("linkedin") && res[uid].linkedin) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="linkedin" src="https://cdn-icons-png.flaticon.com/128/3536/3536505.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("linkedin").style.opacity = '1';
                        document.getElementById("linkedin-input").value = res[uid].linkedin || "";
                        document.getElementById("linkedin").addEventListener("click", () => {
                            window.location.href = document.getElementById("linkedin-input").value;
                        })
                    }
                    if (document.getElementById("kaggle") && res[uid].kaggle) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="kaggle" src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/189_Kaggle_logo_logos-512.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("kaggle").style.opacity = '1';
                        document.getElementById("kaggle-input").value = res[uid].kaggle || "";
                        document.getElementById("kaggle").addEventListener("click", () => {
                            window.location.href = document.getElementById("kaggle-input").value;
                        })
                    }
                    if (document.getElementById("instagram") && res[uid].instagram) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="instagram" src="https://static.cdninstagram.com/rsrc.php/v3/yG/r/De-Dwpd5CHc.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("instagram").style.opacity = '1';
                        document.getElementById("instagram-input").value = res[uid].instagram || "";
                        document.getElementById("instagram").addEventListener("click", () => {
                            window.location.href = document.getElementById("instagram-input").value;
                        })
                    }
                    if (document.getElementById("twitter") && res[uid].twitter) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="twitter" src="https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
                    width="25px" height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("twitter").style.opacity = '1';
                        document.getElementById("twitter-input").value = res[uid].twitter || "";
                        document.getElementById("twitter").addEventListener("click", () => {
                            window.location.href = document.getElementById("twitter-input").value;
                        })
                    }
                    break;
                }

                else {
                    console.log('next record')
                    continue;
                }
            }
        }

        // User is signed in, retrieve their data
        document.getElementById("name").textContent = user.displayName || "No Name";
        document.getElementById("email").textContent = user.email || "No Email";
        document.getElementById("pfp").src = user.photoURL || "default-profile.png";
        document.getElementById("uname").value = user.displayName;
        document.getElementById("uemail").value = user.email;

        //localstorage
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("photoURL", user.photoURL);
    } else {
        // No user is signed in, redirect to sign-in page
        alert("No user signed in! Redirecting to authentication page.");
        window.location.href = "auth.html";
    }
});

// Error handling (optional, but helpful for debugging)
auth.onAuthError = (error) => {
    console.error("Authentication error:", error.message);
    alert("An error occurred during authentication: " + error.message);
};

setPersistence(auth, browserLocalPersistence)
    .then(() => {

        return signInWithPopup(auth, provider);
    })
    .catch((error) => {
        console.error('Sign-in error:', error.message);
    });

document.getElementById("nxtbutton").onclick = function () {
    window.location.href = "posts.html";
}

document.getElementById("button").addEventListener("click", async () => {
    try {
        const snapshot = await get(child(ref(db), "users"));

        if (snapshot.exists()) {
            const res = snapshot.val();
            for (let uid in res) {

                console.log(res);
                if (localStorage.getItem("email") === res[uid].email) {


                    const postData = {
                        username: localStorage.getItem("displayName"),
                        email: localStorage.getItem("email"),
                        photoURL: localStorage.getItem("photoURL"),
                        bio: document.getElementById("msg").value,
                        git: document.getElementById("git").value || "",
                        linkedin: document.getElementById("linkedin-input").value || "",
                        discord: document.getElementById("discord-input").value || "",
                        instagram: document.getElementById("instagram-input").value || "",
                        twitter: document.getElementById("twitter-input").value || "",
                        kaggle: document.getElementById("kaggle-input").value || ""
                    }

                    update(ref(db, `users/${uid}`), postData)
                    document.getElementById("bio").textContent = postData.bio;
                    document.getElementById("name").textContent = res[uid].username || "NName";
                    document.getElementById("email").textContent = res[uid].email || "No Email";
                    document.getElementById("pfp").src = res[uid].photoURL || "default-profile.png";
                    document.getElementById("msg").value = postData.bio || '';

                    if (res[uid].git) {
                        const git = res[uid].git;
                        console.log(git)
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="github" src="https://github.com/fluidicon.png" width="30px" height="30px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("github").style.opacity = '1';
                        document.getElementById("git").value = git || "";
                        document.getElementById("github").addEventListener("click", () => {
                            window.location.href = document.getElementById("git").value;
                        })
                    }
                    if (document.getElementById("discord") && res[uid].discord) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="discord"
                    src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico"
                    width="25px" height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("discord").style.opacity = '1';
                        document.getElementById("discord-input").value = res[uid].discord || "";
                        document.getElementById("discord").addEventListener("click", () => {
                            window.location.href = document.getElementById("discord-input").value;
                        })
                    }
                    if (document.getElementById("linkedin") && res[uid].linkedin) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="linkedin" src="https://cdn-icons-png.flaticon.com/128/3536/3536505.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("linkedin").style.opacity = '1';
                        document.getElementById("linkedin-input").value = res[uid].linkedin || "";
                        document.getElementById("linkedin").addEventListener("click", () => {
                            window.location.href = document.getElementById("linkedin-input").value;
                        })
                    }
                    if (document.getElementById("kaggle") && res[uid].kaggle) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="kaggle" src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/189_Kaggle_logo_logos-512.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("kaggle").style.opacity = '1';
                        document.getElementById("kaggle-input").value = res[uid].kaggle || "";
                        document.getElementById("kaggle").addEventListener("click", () => {
                            window.location.href = document.getElementById("kaggle-input").value;
                        })
                    }
                    if (document.getElementById("instagram") && res[uid].instagram) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="instagram" src="https://static.cdninstagram.com/rsrc.php/v3/yG/r/De-Dwpd5CHc.png" width="25px"
                    height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("instagram").style.opacity = '1';
                        document.getElementById("instagram-input").value = res[uid].instagram || "";
                        document.getElementById("instagram").addEventListener("click", () => {
                            window.location.href = document.getElementById("instagram-input").value;
                        })
                    }
                    if (document.getElementById("twitter") && res[uid].twitter) {
                        const gitelement = document.createElement('div');
                        gitelement.innerHTML = `<img id="twitter" src="https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
                    width="25px" height="25px">`;
                        document.getElementById("intlogo").appendChild(gitelement);
                        document.getElementById("twitter").style.opacity = '1';
                        document.getElementById("twitter-input").value = res[uid].twitter || "";
                        document.getElementById("twitter").addEventListener("click", () => {
                            window.location.href = document.getElementById("twitter-input").value;
                        })
                    }
                    break;
                }

                else {
                    console.log('next record')
                    continue;
                }
            }
        }
    } catch (error) {
        console.error("Error checking user email:", error);
        return false;
    }
}) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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