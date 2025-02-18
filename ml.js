document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref as dbRef, set, get, onChildAdded, onValue, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

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
const database = getDatabase(app);
const storage = getStorage(app);

document.getElementById("file-button").addEventListener("click", () => {
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
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

window.addEventListener('load', async function () {
  try {
    // Get the current user
    const auth = getAuth(app);
    const user = await getCurrentUser(auth);

    if (user) {
      // Get a reference to the 'iot' node in the Firebase Database
      const postsRef = dbRef(database, 'ML Chat');

      // Listen for child added events to the 'iot' node
      onChildAdded(postsRef, (snapshot) => {
        const post = snapshot.val();
        const postId = snapshot.key; // Get the ID of the new post
        if (post) {
          displayPost(postId, post);
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


document.getElementById("send-button").addEventListener('click', async function (e) {
  e.preventDefault();

  const auth = getAuth(app);
  const user = await getCurrentUser(auth);

  if (user) {
    const username = user.displayName;
    const photoURL = user.photoURL;
    const email = user.email;

    const content = document.getElementById('message-input').value;
    var link = document.getElementById('linkupload').value;

    // Create the postData object
    const postData = {
      username,
      photoURL,
      email,
      content,
      link,
      img: '',
      file_link: '',
      file_name: ''
    };

    var file = document.getElementById("docupload").files[0]; // Get the file from the input
    var img = document.getElementById('imgupload').files[0];// Get the image from the input

    if (file && !img) {
      var fname = file.name;
      try {
        postData.file_link = await fileupload(file);
        postData.file_name = fname;
        // Use the URL for further processing, e.g., saving it to the database
      } catch (error) {
        console.error("File upload failed:", error);
      }

      // Save post to Firebase after file upload is complete
      if (username && email) {
        const newPostRef = push(dbRef(database, 'ML Chat/'));
        console.log("Post submitted successfully!");
        set(newPostRef, postData);
      }

    }

    else if (!file && img) {
      // Update postData with the image link and name after upload is successful
      postData.img = await imgupload(img);
      // Save post to Firebase after file upload is complete
      if (username && email) {
        const newPostRef = push(dbRef(database, 'ML Chat/'));
        console.log("Post submitted successfully!");
        set(newPostRef, postData);
      }
    }

    else if (file && img) {
      var fname = file.name;
      try {
        postData.img = await imgupload(img);
        // Update postData with the file link and name after upload is successful
        postData.file_link = await fileupload(file);
        postData.file_name = fname;
      } catch (error) { console.error(error); }

      // Save post to Firebase after file upload is complete
      if (username && email) {
        const newPostRef = push(dbRef(database, 'ML Chat/'));
        console.log("Post submitted successfully!");
        set(newPostRef, postData);
      }

    }

    else {
      // No file to upload, save post immediately
      if (username && email) {
        const newPostRef = push(dbRef(database, 'ML Chat/'));
        console.log("Post submitted successfully without a file!");
        set(newPostRef, postData); // Save post to Firebase
      }
    }

    // Clear form inputs after posting
    document.getElementById("docupload").value = null;
    document.getElementById("imgupload").value = null;
    document.getElementById("linkupload").value = null;
    document.getElementById("message-input").value = null;
  }
  else {
    console.log("user not signed in");
    alert("You're not Authenticated");
    window.location.href = "login.html";
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


document.getElementById("attach").addEventListener("click", () => {
  document.getElementById("popup").style.display = 'none';
})

// Function to display post
async function displayPost(postId, post) {
  const postDiv = document.createElement('div');

  const auth = getAuth(app);
  const user = await getCurrentUser(auth);

  if (user) {
    if (!post.file_link && !post.img && post.link) {
      // Create post content using post data
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <a href="${post.link}">${post.link}</a>
        </div>
      </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <a href="${post.link}">${post.link}</a>
        </div>
      </div><br>`;
      }

    }

    else if (!post.file_link && post.img && !post.link) {
      // Create post content using post data
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <img src="${post.img}">
        </div>
      </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <img src="${post.img}">
        </div>
      </div><br>`;
      }

    }

    else if (!post.file_link && !post.img && !post.link) {
      // Create post content using post data
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
        </div>
      </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
        </div>
      </div><br>`;
      }
    }

    else if (!post.file_link && post.img && post.link) {
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <img src="${post.img}">
        </div>
        <a class="a2" href="${post.link}">${post.link}</a>
      </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
        <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
          <p>${post.content}</p>
          <a class="a3" href="${post.link}">${post.link}</a>
          <img src="${post.img}">
        </div>
      </div><br>`;
      }
    }

    else if (!post.img && post.file_link && !post.link) {

      if (post.username == user.displayName) {

        postDiv.innerHTML = `<div class="my-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <div class="filedisplay-my"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
    }

    else if (post.file_link && post.img && !post.link) {
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <img width="25px" height="25px"
            src="${post.img}">
            <div class="filedisplay-my"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <img width="25px" height="25px"
            src="${post.img}">
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
    }

    else if (!post.img && post.link && post.file_link) {
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <div class="filedisplay-my"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
              <a class="a1" href="${post.link}">${post.link}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
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
              <a class="docurl" href="${post.file_link}">${post.file_name}</a>
              <a class="a1" href="${post.link}">${post.link}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
    }

    else {

      if (post.file_name.length > 13) {
        var fname = post.file_name.slice(0, 10) + "...";
      }
      else {
        var fname = post.file_name;
      }

      // Create post content using post data
      if (post.username == user.displayName) {
        postDiv.innerHTML = `<div class="my-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <img width="25px" height="25px"
            src="${post.img}">
            <div class="filedisplay-my"><svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px"
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
              <a class="docurl" href="${post.file_link}">${fname}</a>
              <a class="a1" href="${post.link}">${post.link}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
      else {
        postDiv.innerHTML = `<div class="other-message">
          <img class="pfp" width="25px" height="25px"
            src="${post.photoURL}">
            <div class="content">
            <p><strong>${post.username}</strong></p>
            <p>${post.content}</p>
            <img width="25px" height="25px"
            src="${post.img}">
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
              <a class="docurl" href="${post.file_link}">${fname}</a>
              <a class="a1" href="${post.link}">${post.link}</a>
            </div><br>
    
          </div>
        </div><br>`;
      }
    }
  }
  else {
    console.log('User not authenticated');
  }


  document.getElementById("messages").appendChild(postDiv);

}

document.getElementById("web").addEventListener("click", () => {
  window.location.href = "web.html";
})

document.getElementById("iot").addEventListener("click", () => {
  window.location.href = "iot.html";
})

document.getElementById("cys").addEventListener("click", () => {
  window.location.href = "cys.html";
})

document.getElementById("gd").addEventListener("click", () => {
  window.location.href = "gd.html";
})

document.getElementById("ds").addEventListener("click", () => {
  window.location.href = "ds.html";
})