document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

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
const d2 = document.querySelectorAll(".intro");
const d3 = document.querySelectorAll(".chat");
const d4 = document.querySelectorAll(".tag");
const d5 = document.querySelectorAll(".post");

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

d5.forEach(item => {
    observer.observe(item);
})

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref as dbRef, set, get, onChildAdded, push, onChildChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


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
const database = getDatabase(app);
const storage = getStorage(app);

document.getElementById("post").addEventListener("click", () => {
    document.getElementById("popup").style.display = 'flex';
})

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popup").style.display = 'none';
})

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById("popup")) {
        document.getElementById("popup").style.display = 'none'; // Hide the pop-up
    }
});


//Uploading images
async function imgupload(file) {
    // Validate that the file exists before using it
    if (!file) {
        console.error("File is undefined. Make sure a file is selected before uploading.");
        return;
    }

    const uniqueName = `images/${Date.now()}-${file.name}`; // Add unique identifier
    const storageref = storageRef(storage, uniqueName);

    console.log(uniqueName);
    console.log(storageref);

    try {
        await uploadBytes(storageref, file);  // Upload file
        const url = await getDownloadURL(storageref);  // Get URL to access file
        console.log(url);
        return url;
    } catch (error) {
        console.error(error);
    }
}

//POST FEATURE
window.addEventListener('load', async function () {
    try {
        // Get the current user
        const auth = getAuth(app);
        const user = await getCurrentUser(auth);

        if (user) {
            // Get a reference to the 'iot' node in the Firebase Database
            const postsRef = dbRef(database, 'Feedback');

            // Listen for child added events to the 'iot' node
            onChildAdded(postsRef, (snapshot) => {
                const post = snapshot.val();
                const postId = snapshot.key; // Get the ID of the new post
                console.log(post);
                if (post) {
                    displayPost(postId, post);
                }
            }, (error) => {
                console.error('Error fetching posts:', error);
            });

            onChildChanged(postsRef, (snapshot) => {
                const post = snapshot.val();
                const postId = snapshot.key;
                if (post) {
                    handleUpvote(postId, post.upvotes); // Update upvote count
                }
            }, (error) => {
                console.error('Error fetching posts:', error);
            });
        } else {
            console.log('User not authenticated');
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
});

async function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                reject(new Error("User not signed in"));
            }
        });
    });
}

document.getElementById("Post").addEventListener('click', async function (e) {

    e.preventDefault();

    const auth = getAuth(app);
    const user = await getCurrentUser(auth);

    if(user){

    const username = user.displayName;
    const photoURL = user.photoURL;
    const email = user.email;
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    var link = document.getElementById('linkupload').value;

    // Create the postData object
    const postData = {
        username,
        photoURL,
        email,
        title,
        desc,
        link,
        img: '',
        upvotes: 0,
        upvotedBy: []
    };

    var img = document.getElementById('imgupload').files[0];// Get the image from the input

    console.log(img);


    if (link && !img) {

        // Save post to Firebase after file upload is complete
        if (username && email) {
            const newPostRef = push(dbRef(database, 'Feedback/'));
            console.log(postData)
            console.log(newPostRef)
            console.log("Post submitted successfully!");
            set(newPostRef, postData);

            // Clear form inputs after posting
            document.getElementById("title").value = null;
            document.getElementById("imgupload").value = null;
            document.getElementById("linkupload").value = null;
            document.getElementById("desc").value = null;
        }

    }

    else if (link && img) {
        try {
            postData.img = await imgupload(img);
            console.log(postData.img);

        } catch (error) { console.error(error); }

        // Save post to Firebase after file upload is complete
        if (username && email) {
            const newPostRef = push(dbRef(database, 'Feedback/'));
            console.log("Post submitted successfully!");
            set(newPostRef, postData);

            // Clear form inputs after posting
            document.getElementById("title").value = null;
            document.getElementById("imgupload").value = null;
            document.getElementById("linkupload").value = null;
            document.getElementById("desc").value = null;
        }

    }

    else {
        if (username && email) {
            const newPostRef = push(dbRef(database, 'Feedback/'));
            console.log("Post submitted successfully!");
            set(newPostRef, postData);

            // Clear form inputs after posting
            document.getElementById("title").value = null;
            document.getElementById("imgupload").value = null;
            document.getElementById("linkupload").value = null;
            document.getElementById("desc").value = null;
        }
    }
}else{
    alert('user not authenticated')
    window.location.href = "login.html";
}

});

document.getElementById("Post").addEventListener("click", () => {
    document.getElementById("popup").style.display = 'none';
})

// Function to display post
async function displayPost(postId, post) {

    const auth = getAuth(app);
    const user = await getCurrentUser(auth);

    if(user){


    const postDiv = document.createElement('div');

    console.log(post);
    console.log(post.file_link);

    if (post.link && !post.img) {
        postDiv.innerHTML = `<div class="postcontainer">
        <div class="uid">
            <img class="pfp" width="25px" height="25px"
                src="${post.photoURL}">
            <strong>${post.username}</strong>
        </div>
        <div class="content">
            <p class="title">${post.title}</p>
            <p class="desc">${post.desc}</p>
        </div>
        <p>
            <a class="link" href="${post.link}">${post.link}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 9V15C18 16.6543 16.6543 18 15 18H3C1.3457 18 0 16.6543 0 15V3C0 1.3457 1.3457 0 3 0H9C9.55273 0 10 0.44775 10 1C10 1.55225 9.55273 2 9 2H3C2.44824 2 2 2.44873 2 3V15C2 15.5513 2.44824 16 3 16H15C15.5518 16 16 15.5513 16 15V9C16 8.44775 16.4473 8 17 8C17.5527 8 18 8.44775 18 9ZM17 0H13C12.4473 0 12 0.44775 12 1C12 1.55225 12.4473 2 13 2H14.5859L5.29297 11.293C4.90235 11.6836 4.90235 12.3164 5.29297 12.707C5.48828 12.9023 5.74414 13 6 13C6.25586 13 6.51172 12.9023 6.70703 12.707L16 3.41406V5C16 5.55225 16.4473 6 17 6C17.5527 6 18 5.55225 18 5V1C18 0.44775 17.5527 0 17 0Z"
                        fill="white" />
                </svg></a>
        </p>
        <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
        <span class="upvote-count"> • ${post.upvotes || 0}</span>
    </div>`;
    }

    else if (post.link && post.img) {
        postDiv.innerHTML = `<div class="postcontainer">
        <div class="uid">
            <img class="pfp" width="25px" height="25px"
                src="${post.photoURL}">
            <strong>${post.username}</strong>
        </div>
        <div class="content">
            <p class="title">${post.title}</p>
            <p class="desc">${post.desc}</p>
        </div>
        <img
            src="${post.img}">
        <p>
            <a class="link" href="${post.link}">${post.link}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 9V15C18 16.6543 16.6543 18 15 18H3C1.3457 18 0 16.6543 0 15V3C0 1.3457 1.3457 0 3 0H9C9.55273 0 10 0.44775 10 1C10 1.55225 9.55273 2 9 2H3C2.44824 2 2 2.44873 2 3V15C2 15.5513 2.44824 16 3 16H15C15.5518 16 16 15.5513 16 15V9C16 8.44775 16.4473 8 17 8C17.5527 8 18 8.44775 18 9ZM17 0H13C12.4473 0 12 0.44775 12 1C12 1.55225 12.4473 2 13 2H14.5859L5.29297 11.293C4.90235 11.6836 4.90235 12.3164 5.29297 12.707C5.48828 12.9023 5.74414 13 6 13C6.25586 13 6.51172 12.9023 6.70703 12.707L16 3.41406V5C16 5.55225 16.4473 6 17 6C17.5527 6 18 5.55225 18 5V1C18 0.44775 17.5527 0 17 0Z"
                        fill="white" />
                </svg></a>
        </p>
        <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
        <span class="upvote-count"> • ${post.upvotes || 0}</span>
    </div>`;
    }

    else {
        postDiv.innerHTML = `<div class="postcontainer">
        <div class="uid">
            <img class="pfp" width="25px" height="25px"
                src="${post.photoURL}">
            <strong>${post.username}</strong>
        </div>
        <div class="content">
            <p class="title">${post.title}</p>
            <p class="desc">${post.desc}</p>
        </div>
        <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
        <span class="upvote-count"> • ${post.upvotes || 0}</span>
    </div>`;
    }

    document.body.appendChild(postDiv);
    // Selecting both buttons correctly
    const upvoteBtn = postDiv.querySelector('.upvote-btn');       // Assuming 'upvote-btn' is a class

    // Reusable upvote function
    function handleUpvote(button) {
        const postRef = dbRef(database, `Feedback/${postId}`);
        get(postRef).then((snapshot) => {
            const postData = snapshot.val();
            const username = user.displayName;

            if (!postData.upvotedBy) {
                postData.upvotedBy = [];
            }

            // Check if the user has already upvoted
            if (!postData.upvotedBy.includes(username)) {
                postData.upvotes = postData.upvotes ? postData.upvotes + 1 : 1;
                postData.upvotedBy.push(username);

                set(postRef, postData).then(() => {
                    // Disable the upvote button after a successful upvote
                    button.disabled = true;
                });
            } else {
                // If the user already upvoted, disable the button
                button.disabled = true;
            }
        });
    }

    // Add click event listeners for both buttons
    if (upvoteBtn) {
        upvoteBtn.addEventListener('click', () => handleUpvote(upvoteBtn));
    } else {
        console.error("Upvote button not found");
    }
}else {
    alert('user not authenticated')
    window.location.href("login.html");
}

}