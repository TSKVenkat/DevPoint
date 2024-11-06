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

// Get all elements to observe
const d1 = document.querySelectorAll('.section');
const d2 = document.querySelectorAll('.msg1');
const d3 = document.querySelectorAll('.msg2');
const d4 = document.querySelectorAll('.chats');
const d5 = document.querySelectorAll('.feedreq');
const d6 = document.querySelectorAll('.feature');
const d7 = document.querySelectorAll('.feedtitle');
const d8 = document.querySelectorAll('.feed');
const d9 = document.querySelectorAll('.canvas');
const d10 = document.querySelectorAll('.canvasinfo');
const d11 = document.querySelectorAll('.show');
const d12 = document.querySelectorAll('.reply');
const d13 = document.querySelectorAll('.guidelines');
const d14 = document.querySelectorAll('.guide');
const d15 = document.querySelectorAll('.button');

// Observe each element
d1.forEach(item => {
    observer.observe(item);
});

d2.forEach(item => {
    observer.observe(item);
});

d3.forEach(item => {
    observer.observe(item);
});

d4.forEach(item => {
    observer.observe(item);
});

d5.forEach(item => {
    observer.observe(item);
});

d6.forEach(item => {
    observer.observe(item);
});

d7.forEach(item => {
    observer.observe(item);
});

d8.forEach(item => {
    observer.observe(item);
});

d9.forEach(item => {
    observer.observe(item);
});

d10.forEach(item => {
    observer.observe(item);
});

d11.forEach(item => {
    observer.observe(item);
});

d12.forEach(item => {
    observer.observe(item);
});

d13.forEach(item => {
    observer.observe(item);
});

d14.forEach(item => {
    observer.observe(item);
});

d15.forEach(item => {
    observer.observe(item);
});

document.getElementById("ml").addEventListener("click",()=>{
    window.location.href = "ml.html";
})

document.getElementById("iot").addEventListener("click",()=>{
    window.location.href = "iot.html";
})

document.getElementById("cys").addEventListener("click",()=>{
    window.location.href = "cys.html";
})

document.getElementById("ds").addEventListener("click",()=>{
    window.location.href = "ds.html";
})

document.getElementById("web").addEventListener("click",()=>{
    window.location.href = "web.html";
})

document.getElementById("gd").addEventListener("click",()=>{
    window.location.href = "gd.html";
})

document.getElementById("cc").addEventListener("click",()=>{
    window.location.href = "canvas.html";
})

document.getElementById("ff").addEventListener("click",()=>{
    window.location.href = "feedback.html";
})