document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'U' || e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref as dbRef, set, get, onChildAdded, push, onChildChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";


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
  // Create file metadata
  const metadata = {
    contentType: file.type
  };

  console.log('into file checking SUCCESS');
  console.log(file.name);

  // Create storage reference
  const fileRef = storageRef(storage, `Files/${file.name}`);

  try {
    // Start the upload and wait for it to complete
    const uploadSnapshot = await uploadBytesResumable(fileRef, file, metadata);
    console.log('Upload complete! Getting download URL...');

    // Get the download URL once the upload is complete
    const downloadURL = await getDownloadURL(uploadSnapshot.ref);
    console.log("File available at:", downloadURL);

    // Return the URL so it can be used later
    return downloadURL;

  } catch (error) {
    console.error("File upload failed:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}


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
window.addEventListener('load', function () {
  // Reference to the posts collection in Firebase
  const postsRef = dbRef(database, 'ML Chat');

  // Listen for new and existing posts
  onChildAdded(postsRef, (snapshot) => {
    const post = snapshot.val();
    console.log(post);
    const postId = snapshot.key;
    displayPost(postId, post); // Call function to display post
  });

});

document.getElementById("send-button").addEventListener('click', async function (e) {
  e.preventDefault();

  const username = localStorage.getItem("displayName");
  const photoURL = localStorage.getItem("photoURL");
  const email = localStorage.getItem("email");
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
          const newPostRef = push(dbRef(database, 'ML Chat/'));
          console.log(postData)
          console.log(newPostRef)
          console.log("Post submitted successfully!");
          set(newPostRef, postData);
      }

  }

  else if (!file && img) {
      // Update postData with the image link and name after upload is successful
      postData.img = await imgupload(img);
      console.log(postData.img);
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
          console.log(postData.img);
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

});

document.getElementById("attach").addEventListener("click", () => {
  document.getElementById("popup").style.display = 'none';
})

// Function to display post
function displayPost(postId, post) {
  const postDiv = document.createElement('div');

  console.log(post);
  console.log(post.file_link);

  if (!post.file_link && !post.img && post.link) {
      // Create post content using post data
      if (post.username == localStorage.getItem("displayName")) {
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
      if (post.username == localStorage.getItem("displayName")) {
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
      if (post.username == localStorage.getItem("displayName")) {
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
      if (post.username == localStorage.getItem("displayName")) {
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

      if (post.username == localStorage.getItem("displayName")) {

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
      if (post.username == localStorage.getItem("displayName")) {
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
      if (post.username == localStorage.getItem("displayName")) {
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
      console.log(post.file_link);

      if (post.file_name.length > 13) {
          var fname = post.file_name.slice(0, 10) + "...";
          console.log(fname);
      }
      else {
          var fname = post.file_name;
      }

      // Create post content using post data
      if (post.username == localStorage.getItem("displayName")) {
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

  document.getElementById("messages").appendChild(postDiv);

}

document.getElementById("web").addEventListener("click", () => {
  window.location.href = "web.html";
})

document.getElementById("ds").addEventListener("click", () => {
  window.location.href = "ds.html";
})

document.getElementById("cys").addEventListener("click", () => {
  window.location.href = "cys.html";
})

document.getElementById("gd").addEventListener("click", () => {
  window.location.href = "gd.html";
})

document.getElementById("iot").addEventListener("click", () => {
  window.location.href = "iot.html";
})