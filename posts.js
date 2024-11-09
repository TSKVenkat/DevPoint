document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref as dbRef, set, get, onChildAdded, push, onChildChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

console.log(analytics);

if (!app) {
    console.error("Firebase app was not initialized properly.");
} else {
    console.log("Firebase initialized successfully.");
}


const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is authenticated:", user.uid);
        // Proceed to write to the database
    } else {
        console.log("User is not authenticated.");
        // Redirect to login or handle unauthenticated state
    }
});

// Elements
const reportsRef = dbRef(database, 'reports');
// const storageRef = ref(storage, 'files');
const reportButton = document.getElementById('reportbutton');
const postButton = document.getElementById('post-button');
const reportinput = document.getElementById('message-report');
const postinput = document.getElementById('message-post');
const sendButton = document.getElementById('postbutton');
const popup = document.getElementById('popup');
const popup_report = document.getElementById('popup-report');
const popup_post = document.getElementById("popup-post");
const popupTrigger = document.getElementById('notice');
const popupTrigger_report = document.getElementById('report');
const closePopup = document.getElementById('closePopup');
const closereport = document.getElementById("close-report");
const closepost = document.getElementById('close-post');
const popupcontent = document.getElementById("popup-content");
const report_content = document.getElementById('report-content');
const post_content = document.getElementById('post-content');
const creator = document.getElementById("about");

//FUNCTIONS
async function fileupload(file) {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        console.log("User is not authenticated. Please log in.");
        return null;
    }

    if (!file) {
        console.error("File is undefined. Make sure a file is selected before uploading.");
        return null;
    }

    const metadata = {
        contentType: file.type
    };

    const uniqueName = `Files/${Date.now()}-${file.name}`; // Generate unique file name
    const storageref = storageRef(storage, uniqueName, metadata);

    try {
        await uploadBytes(storageref, file);  // Upload file to Firebase Storage
        const url = await getDownloadURL(storageref);  // Get URL to access file
        console.log("File uploaded successfully. URL:", url);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}


//Uploading images
async function imgupload(file) {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        console.log("User is not authenticated. Please log in.");
        return null;
    }

    if (!file) {
        console.error("File is undefined. Make sure a file is selected before uploading.");
        return null;
    }

    const uniqueName = `images/${Date.now()}-${file.name}`; // Generate unique file name
    const storageref = storageRef(storage, uniqueName);

    try {
        await uploadBytes(storageref, file);  // Upload file to Firebase Storage
        const url = await getDownloadURL(storageref);  // Get URL to access file
        console.log("File uploaded successfully. URL:", url);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}

// Show the pop-up when the button is clicked
popupTrigger.addEventListener('click', () => {
    popup.style.display = 'flex'; // Show the pop-up
});

// Close the pop-up when the close button is clicked
closePopup.addEventListener('click', () => {
    popup.style.display = 'none'; // Hide the pop-up
});

// Close the pop-up when clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none'; // Hide the pop-up
    }
});

// Show the pop-up when the button is clicked
popupTrigger_report.addEventListener('click', () => {
    popup_report.style.display = 'flex'; // Show the pop-up
});

// Close the pop-up when the close button is clicked
closereport.addEventListener('click', () => {
    popup_report.style.display = 'none'; // Hide the pop-up
});

// Close the pop-up when clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === popup_report) {
        popup_report.style.display = 'none';// Hide the pop-up
    }
});

async function sendReport(report) {
    const username = localStorage.getItem('displayName');
    const userEmail = localStorage.getItem('email');

    let postDate = new Date(Date.now());
    let formattedDate = postDate.getFullYear() + "-" +
        (postDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
        postDate.getDate().toString().padStart(2, '0') + " " +
        postDate.getHours().toString().padStart(2, '0') + ":" +
        postDate.getMinutes().toString().padStart(2, '0');

    const reportContent = `Report from ${username}, ${userEmail} at ${formattedDate}\n\n${report}`;
    try {
        const response = await fetch('https://devpoint-7u5k.onrender.com/send-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, reportContent })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);  // Success message
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Send report
reportButton.addEventListener('click', () => {
    const auth = getAuth()
    const user = auth.currentUser;
    if (user) {
        const message = reportinput.value;
        if (message) {
            const newMessageRef = push(reportsRef);
            set(newMessageRef, { username: user.displayName, email: user.email, report: message });
            sendReport(message);
        }
    }
    else {
        console.log('user is not authenticated')
    }
});

// Listen for new messages
onChildAdded(reportsRef, (data) => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        const report = data.val().report;
        console.log(report);
        reportinput.value = '';
        popup_report.style.display = 'none';
    }
    else {
        console.log('user is not authenticated')
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('theme-toggle');

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');

        // Update button text based on theme
        if (document.body.classList.contains('dark-theme')) {
            themeToggleBtn.textContent = 'Dark Theme';
            sendButton.style.backgroundColor = "black";
            postButton.style.backgroundColor = "black";
            popupcontent.style.color = "black";
            report_content.style.color = 'black';
            post_content.style.color = 'black';
            reportinput.style.color = 'black';
            postinput.style.color = 'black';
            document.getElementById("titleupload").style.color = 'black';
            document.getElementById("subupload").style.color = 'black';
            document.getElementById("linkupload").style.color = 'black';

        } else {
            themeToggleBtn.textContent = 'Blue Theme';
            sendButton.style.backgroundColor = "blue";
            postButton.style.backgroundColor = "blue";
            popupcontent.style.color = "white";
            report_content.style.color = 'white';
            reportinput.style.color = 'blue';
            post_content.style.color = 'white';
            postinput.style.color = 'blue';
            document.getElementById("titleupload").style.color = 'blue';
            document.getElementById("subupload").style.color = 'blue';
            document.getElementById("linkupload").style.color = 'blue';
            document.getElementById("postbuttondiv").style.color = 'white';
        }

        // Save theme preference
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
    }

    function initTheme() {
        // Check for saved theme preference
        const isDarkTheme = localStorage.getItem('darkTheme') === 'true';

        // Apply the saved theme
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = 'Dark Theme';
            sendButton.style.backgroundColor = "black";
            postButton.style.backgroundColor = "black";
            popupcontent.style.color = "black";
            report_content.style.color = 'black';
            reportinput.style.color = 'black';
            post_content.style.color = 'black';
            postinput.style.color = 'black';
            document.getElementById("titleupload").style.color = 'black';
            document.getElementById("subupload").style.color = 'black';
            document.getElementById("linkupload").style.color = 'black';
        } else {
            themeToggleBtn.textContent = 'Blue Theme';
            sendButton.style.backgroundColor = "blue";
            postButton.style.backgroundColor = "blue";
            popupcontent.style.color = "white";
            report_content.style.color = 'white';
            reportinput.style.color = 'blue';
            postinput.style.color = 'blue';
            post_content.style.color = 'white';
            document.getElementById("titleupload").style.color = 'blue';
            document.getElementById("subupload").style.color = 'blue';
            document.getElementById("linkupload").style.color = 'blue';
            document.getElementById("postbuttondiv").style.color = 'white';
        }

        // Add click event listener to the button
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
        } else {
            console.error("Theme toggle button not found");
        }
    }

    // Initialize the theme
    initTheme();
});

//Posts Feature

// Show the pop-up when the button is clicked
sendButton.addEventListener('click', () => {
    popup_post.style.display = 'flex'; // Show the pop-up
});

// Close the pop-up when the close button is clicked
closepost.addEventListener('click', () => {
    popup_post.style.display = 'none'; // Hide the pop-up
});

// Close the pop-up when clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === popup_post) {
        popup_post.style.display = 'none'; // Hide the pop-up
    }
});

//POST FEATURE
window.addEventListener('load', function () {
    // Reference to the posts collection in Firebase
    const postsRef = dbRef(database, 'posts');

    // Listen for new and existing posts
    onChildAdded(postsRef, (snapshot) => {
        const post = snapshot.val();
        console.log(post);
        const postId = snapshot.key;
        displayPost(postId, post); // Call function to display post
    });

    onChildChanged(postsRef, (snapshot) => {
        const post = snapshot.val();
        const postId = snapshot.key;
        handleUpvote(postId, post.upvotes); // Update upvote count
    });
});

// Add event listener for post button
postButton.addEventListener('click', async function (e) {
    e.preventDefault();

    const auth = getAuth(app);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const username = user.displayName;
            const email = user.email;
            const title = document.getElementById('titleupload').value;
            const subject = document.getElementById('subupload').value;
            const content = document.getElementById('message-post').value;
            const link = document.getElementById('linkupload').value;

            // Create the postData object
            const postData = {
                username,
                email,
                timestamp: Date.now(),
                title,
                subject,
                content,
                link,
                img: '',
                file_link: '',
                file_name: '',
                upvotes: 0,
                upvotedBy: [] // Store user IDs who have upvoted
            };

            const file = document.getElementById("docupload").files[0]; // Get the file from the input
            const img = document.getElementById('imgupload').files[0];// Get the image from the input

            console.log(img);

            console.log(file);

            if (file && !img) {
                var fname = file.name;
                try {
                    postData.file_link = await fileupload(file);
                    postData.file_name = fname;
                    console.log("File uploaded successfully. Download URL:", url);
                    // Use the URL for further processing, e.g., saving it to the database
                } catch (error) {
                    console.error("File upload failed:", error);
                }

                // Save post to Firebase after file upload is complete
                if (username && email) {
                    const newPostRef = push(dbRef(database, 'posts/'));
                    console.log(postData)
                    console.log(newPostRef)
                    set(newPostRef, postData);
                }

                console.log("Post submitted successfully!");
            }

            else if (!file && img) {
                // Update postData with the image link and name after upload is successful
                postData.img = await imgupload(img);
                console.log(postData.img);
                // Save post to Firebase after file upload is complete
                if (username && email) {
                    const newPostRef = push(dbRef(database, 'posts/'));
                    set(newPostRef, postData);
                }

                console.log("Post submitted successfully!");
            }

            else if (file && img) {
                var fname = file.name;
                try {
                    postData.img = await imgupload(img);
                    console.log(postData.img);
                    // Update postData with the file link and name after upload is successful
                    postData.file_link = await fileupload(file);
                    postData.file_name = fname;
                } catch (error) { console.error(error); }

                // Save post to Firebase after file upload is complete
                if (username && email) {
                    const newPostRef = push(dbRef(database, 'posts/'));
                    set(newPostRef, postData);
                }

                console.log("Post submitted successfully!");
            }

            else {
                // No file to upload, save post immediately
                if (username && email) {
                    const newPostRef = push(dbRef(database, 'posts/'));
                    set(newPostRef, postData); // Save post to Firebase
                }

                console.log("Post submitted successfully without a file!");
            }

            // Clear form inputs after posting
            document.getElementById('post-content').reset();
            popup_post.style.display = 'none';
        }
        else {
            console.log("user is not authenticated");
        }
    })

});

// Function to display post
function displayPost(postId, post) {
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const postDiv = document.createElement('div');

            let postDate = new Date(post.timestamp);
            let formattedDate = postDate.getFullYear() + "-" +
                (postDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                postDate.getDate().toString().padStart(2, '0') + " " +
                postDate.getHours().toString().padStart(2, '0') + ":" +
                postDate.getMinutes().toString().padStart(2, '0');

            console.log(post);
            console.log(post.file_link);

            if (!post.file_link && !post.img && post.link) {
                // Create post content using post data
                postDiv.innerHTML = `
    <div class="postcontainer">
        <div class="layout">
        <span class="username">${post.username}</span><br>
    <h2 class="title">${post.title}</h2>
    <h4 class="subject">${post.subject}</h4>
    <p class="content">${post.content}</p>
    <a class="link" href="${post.link}" target='_blank'>${post.link}</a><br>
    <span class="timestamp">${formattedDate}</span><br><br>
    <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
    <span class="upvote-count"> • ${post.upvotes || 0}</span></div></div>
    `;

            }

            else if (!post.file_link && !post.img && !post.link) {
                // Create post content using post data
                postDiv.innerHTML = `
    <div class="postcontainer">
        <div class="layout">
        <span class="username">${post.username}</span><br>
    <h2 class="title">${post.title}</h2>
    <h4 class="subject">${post.subject}</h4>
    <p class="content">${post.content}</p>
    <span class="timestamp">${formattedDate}</span><br><br>
    <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
    <span class="upvote-count"> • ${post.upvotes || 0}</span></div></div>
    `;

            }

            else if (!post.file_link && post.img && post.link) {
                postDiv.innerHTML = `<div class="postcontainer-limg">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p>
            <a class="link" href="${post.link}" target='_blank'>${post.link}</a><br><br>
            <img src="https://cdn.pixabay.com/photo/2019/03/17/22/58/earth-4062072_640.jpg">
            <div>
                <span class="timestamp-img">${formattedDate}</span><br><br>
                <button class="upvote-btn-img" data-post-id="${postId}">Upvote</button>
                <span class="upvote-count-img"> • ${post.upvotes || 0}</span>
            </div>
        </div>
    </div>`;
            }

            else if (!post.file_link && post.img && !post.link) {
                postDiv.innerHTML = `<div class="postcontainer-img">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p>
            <img src="${post.img}">
            <div>
                <span class="timestamp-img">${formattedDate}</span><br><br>
                <button class="upvote-btn-img" data-post-id="${postId}">Upvote</button>
                <span class="upvote-count-img"> • ${post.upvotes || 0}</span>
            </div>
        </div>
    </div>`;
            }

            else if (!post.img && post.file_link && post.link) {

                if (post.file_name.length > 13) {
                    var fname = post.file_name.slice(0, 10) + "...";
                    console.log(fname);
                }
                else {
                    var fname = post.file_name;
                }

                postDiv.innerHTML = `<div class="postcontainer-file">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p>
            <a class="link" href="${post.link}" target='_blank'>${post.link}</a><br>
            <div class="filedisplay"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
                    viewBox="0 0 400 400">

                    <defs>

                        <style>
                            .cls-1 {
                                fill: #FFFFFF
                            }
                        </style>

                    </defs>

                    <title />

                    <g id="xxx-file">

                        <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" />

                        <path class="cls-1"
                            d="M300,380H100a30,30,0,0,1-30-30V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100V350A30,30,0,0,1,300,380ZM100,30A20,20,0,0,0,80,50V350a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V102.07L247.93,30Z" />

                        <path class="cls-1" d="M275,180H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,230H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" />

                    </g>

                </svg>
                <div id="sd"><a class="docurl" href="${post.file_link}" target="_blank">${fname}</a><div></div>
                    <span class="timestamp-file">${formattedDate}</span><br><br>
                    <button class="upvote-btn-file" data-post-id="${postId}">Upvote</button>
                    <span class="upvote-count-file"> • ${post.upvotes || 0}</span>
                </div>
            </div>
        </div>
    </div>`;
            }

            else if (post.file_link && post.img && !post.link) {

                if (post.file_name.length > 13) {
                    var fname = post.file_name.slice(0, 10) + "...";
                    console.log(fname);
                }
                else {
                    var fname = post.file_name;
                }

                postDiv.innerHTML = `<div class="postcontainer-fimg">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p><br>
            <img src="${post.img}">
            <div class="filedisplay"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
                    viewBox="0 0 400 400">

                    <defs>

                        <style>
                            .cls-1 {
                                fill: #FFFFFF
                            }
                        </style>

                    </defs>

                    <title />

                    <g id="xxx-file">

                        <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" />

                        <path class="cls-1"
                            d="M300,380H100a30,30,0,0,1-30-30V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100V350A30,30,0,0,1,300,380ZM100,30A20,20,0,0,0,80,50V350a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V102.07L247.93,30Z" />

                        <path class="cls-1" d="M275,180H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,230H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" />

                    </g>

                </svg>
                <div id="sd"><a class="docurl" href="${post.file_link}" target="_blank">${fname}</a>
                    <div></div>
                    <span class="timestamp">${formattedDate}</span><br><br>
                    <button class="upvote-btn" data-post-id="${postId}">Upvote</button>
                    <span class="upvote-count"> • ${post.upvotes || 0}</span>
                </div>
            </div>
        </div>
    </div>`;
            }

            else if (!post.img && !post.link && post.file_link) {
                if (post.file_name.length > 13) {
                    var fname = post.file_name.slice(0, 10) + "...";
                    console.log(fname);
                }
                else {
                    var fname = post.file_name;
                }
                postDiv.innerHTML = `<div class="postcontainer-file">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p>
            <div class="filedisplay"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
                    viewBox="0 0 400 400">

                    <defs>

                        <style>
                            .cls-1 {
                                fill: #FFFFFF
                            }
                        </style>

                    </defs>

                    <title />

                    <g id="xxx-file">

                        <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" />

                        <path class="cls-1"
                            d="M300,380H100a30,30,0,0,1-30-30V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100V350A30,30,0,0,1,300,380ZM100,30A20,20,0,0,0,80,50V350a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V102.07L247.93,30Z" />

                        <path class="cls-1" d="M275,180H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,230H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" />

                    </g>

                </svg>
                <div id="sd"><a class="docurl" href="${post.file_link}" target="_blank">${fname}</a>
                    <div></div>
                    <span class="timestamp-file">${formattedDate}</span><br><br>
                    <button class="upvote-btn-file" data-post-id="${postId}">Upvote</button>
                    <span class="upvote-count-file"> • ${post.upvotes || 0}</span>
                </div>
            </div>
        </div>
    </div>`;
            }

            else {
                console.log(post.file_link);

                if (post.file_name.length > 13) {
                    var fname = post.file_name.slice(0, 10) + "...";
                    console.log(fname);
                }
                else {
                    var fname = post.file_name;
                }

                // Create post content using post data
                postDiv.innerHTML = `<div class="postcontainer-flimg">
        <div class="layout">
            <span class="username">${post.username}</span><br>
            <h2 class="title">${post.title}</h2>
            <h4 class="subject">${post.subject}</h4>
            <p class="content">${post.content}</p>
            <a class="link" href="${post.link}" target='_blank'>${post.link}</a><br><br>
            <img src="${post.img}">
            <div class="filedisplay"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
                    viewBox="0 0 400 400">

                    <defs>

                        <style>
                            .cls-1 {
                                fill: #FFFFFF
                            }
                        </style>

                    </defs>

                    <title />

                    <g id="xxx-file">

                        <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" />

                        <path class="cls-1"
                            d="M300,380H100a30,30,0,0,1-30-30V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100V350A30,30,0,0,1,300,380ZM100,30A20,20,0,0,0,80,50V350a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V102.07L247.93,30Z" />

                        <path class="cls-1" d="M275,180H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,230H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />

                        <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" />

                    </g>

                </svg>
                <div id="sd"><a class="docurl" href="${post.file_link}" target="_blank">${fname}</a>
                    <div></div>
                    <span class="timestamp-file">${formattedDate}</span><br><br>
                    <button id = 'upvote-btn-file' class="upvote-btn-file" data-post-id="${postId}">Upvote</button>
                    <span class="upvote-count-file"> • ${post.upvotes || 0}</span>
                </div>
            </div>
        </div>
    </div>
    `;

            }

            // Append the post to the messages container
            document.getElementById("messages").appendChild(postDiv);

            // Selecting both buttons correctly
            const upvoteBtn = postDiv.querySelector('.upvote-btn');       // Assuming 'upvote-btn' is a class
            const upvoteBtnFile = postDiv.querySelector('.upvote-btn-file');  // Assuming 'upvote-btn-file' is a class

            // Reusable upvote function
            function handleUpvote(button) {
                const postRef = dbRef(database, `posts/${postId}`);
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

            if (upvoteBtnFile) {
                upvoteBtnFile.addEventListener('click', () => handleUpvote(upvoteBtnFile));
            } else {
                console.error("File upvote button not found");
            }
        }

        else {
            console.log('user is not authenticated');
        }
    })
}


creator.addEventListener("click", function () {
    window.location.href = "creator.html";
})

document.getElementById("posts").addEventListener("click", function () {
    window.location.href = "posts.html";
})

document.getElementById("chat").addEventListener("click", function () {
    window.location.href = "community.html";
})

document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "profile.html";
})

document.getElementById("meta").addEventListener("click", function () {
    window.location.href = "meta.html";
})

document.getElementById("signout").addEventListener("click", () => {
    // Sign-out successful, now clear LocalStorage
    localStorage.clear();

    // Redirect to sign-in page or wherever you want
    window.location.href = "index.html";
})