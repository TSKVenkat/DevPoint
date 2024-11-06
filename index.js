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
const d1 = document.querySelectorAll('.div1');
const d2 = document.querySelectorAll('.div2');
const p1 = document.querySelectorAll('.tools');
const p2 = document.querySelectorAll('.tools-text');

// Observe each element
d1.forEach(item => {
    observer.observe(item);
});

// Observe each element
d2.forEach(item => {
    observer.observe(item);
});

// Observe each element
p1.forEach(item => {
    observer.observe(item);
});

// Observe each element
p2.forEach(item => {
    observer.observe(item);
});

document.getElementById("sd2").onclick = function () {
    document.getElementById("sd2").style.backgroundColor = "#ffcc0000";
    document.getElementById("t1").style.marginRight = "0px";
    document.getElementById("t1").style.marginLeft = "250px";
    document.getElementById("sd1").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd3").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd4").style.backgroundColor = "#ffcc001a";
    document.getElementById("img2").src = "";
    document.getElementById("img3").src = "https://i.pinimg.com/564x/48/1b/2a/481b2a6fb860882fcb91e29cf2795a26.jpg";
    document.getElementById("t1").innerHTML = `
I developed <strong>Devpoint</strong> because, as a student myself, I know how hard it can be to find the right resources when you're trying to learn new skills like Machine Learning, Web Development, or other domains of computer science. A lot of times, you spend hours searching for the best tutorials or guides, and even then, it’s hard to know if what you found is actually useful.

With Devpoint, I wanted to make that process easier.<i>It’s a platform where students and developers can sign up, post resources like tutorials or articles, and share them with others</i>.These posts can get upvoted by the community. The idea is to create a space where everyone benefits from each other's learning experiences.

    What’s great about Devpoint is that <i>anyone can contribute and access these resources, so you're not just learning from a limited set of sources—you’re learning from a global community</i>, and because it’s peer-driven, you know that the content has been tested and approved by people who are in the same boat as you.

This platform is especially <i>helpful for students who want to upskill but don't know where to start. Instead of spending hours searching for resources, you can quickly find what you need through posts that your peers have already recommended</i>. Plus, if you find something helpful yourself, you can post it and help others too. It’s a win-win, and your contribution can reach a large audience, making an impact on a broader scale.

In essence, I built Devpoint to simplify the learning process and create a space where students can collaborate and grow together, sharing knowledge and helping each other succeed.`;
    document.getElementById("loginbut").style.display = "none";
    document.getElementById("signupbut").style.display = "none";
}

document.getElementById("sd1").onclick = function () {
    document.getElementById("t1").style.marginLeft = "0px";
    document.getElementById("t1").style.marginRight = "250px";
    document.getElementById("sd1").style.backgroundColor = "#ffcc0000";
    document.getElementById("sd2").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd3").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd4").style.backgroundColor = "#ffcc001a";
    document.getElementById("img3").src = "";
    document.getElementById("img2").src = "https://i.pinimg.com/736x/7f/7b/0c/7f7b0c9bf14ae9b769705a071dfb6dd0.jpg";
    /*document.getElementById("t1").textContent = `At its core, Devpoint is a community platform where users can sign up to share and discover valuable resources in the field of computer science, covering topics like competitive programming, web development, and more. Once registered, users can create posts similar to tweets, sharing links, tutorials, articles, or insights they find helpful. These posts can then be upvoted by others, allowing the best and most useful content to rise to the top.

What makes Devpoint unique is its open, collaborative nature. Anyone with an account can both access and contribute resources, creating a vast pool of knowledge that's easily searchable and peer-reviewed. This model ensures that learning isn't just limited to what you can find through traditional channels, but can come directly from fellow learners and professionals in the field.

Through this project, users can quickly find high-quality resources from their peers, allowing them to upskill more efficiently. The platform’s open nature also means that your contributions are not limited to a small group—your shared content can reach a large audience of developers from around the world, amplifying the impact of your help and insights.

In essence, Devpoint is designed to create a large-scale, user-driven repository of knowledge, helping people learn faster and more collaboratively.`;*/
    document.getElementById("t1").innerHTML = `At its core, <strong>DevPoint</strong> is a <i>community platform</i> where users can sign up to
            share and discover
            valuable resources in the field of computer science, covering topics like competitive programming, web
            development, and more. Once registered, users can create posts similar to tweets, sharing links, tutorials,
            articles, or insights they find helpful. These posts can then be upvoted by others, allowing the best and
            most useful content to rise to the top.

            What makes Devpoint unique is its open, collaborative nature. <i>Anyone with an account can both access and
                contribute resources, creating a vast pool of knowledge that's easily searchable and peer-reviewed</i>.
            This
            model ensures that learning isn't just limited to what you can find through traditional channels, but can
            come directly from fellow learners and professionals in the field.

            Through this project, users can quickly find high-quality resources from their peers, allowing them to
            upskill more efficiently. <i>The platform’s open nature also means that your contributions are not limited
                to a
                small group—your shared content can reach a large audience of developers, amplifying
                the impact of your help and insights</i>.

            In essence, Devpoint is designed to create a large-scale, user-driven repository of knowledge, helping
            people learn faster and more collaboratively.`;
    document.getElementById("loginbut").style.display = "none";
    document.getElementById("signupbut").style.display = "none";
}

document.getElementById("sd3").onclick = function () {
    document.getElementById("img3").src = "";
    document.getElementById("t1").style.marginLeft = "10px";
    document.getElementById("sd3").style.backgroundColor = "#ffcc0000";
    document.getElementById("sd2").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd1").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd4").style.backgroundColor = "#ffcc001a";
    document.getElementById("img2").src = "";
    document.getElementById("t1").textContent = `Welcome to Devpoint! We're excited to have you join this growing community of learners and developers. By signing up, you're stepping into a space designed to help you grow your skills in competitive programming, web development, and other computer science fields. Whether you're here to discover valuable resources or share what you've learned, you're contributing to a larger goal: making learning easier and more collaborative for everyone.

On Devpoint, every post you make has the potential to help someone else, and every resource you find could be the key to unlocking your next big breakthrough. Explore, contribute, and engage with your peers—together, we can create a more accessible and supportive environment for upskilling.

Thanks for being a part of this journey. Let’s make learning a shared experience!`;
    document.getElementById("signupbut").style.display = "block";
    document.getElementById("loginbut").style.display = "none";
}

document.getElementById("sd4").onclick = function () {
    document.getElementById("img3").src = "";
    document.getElementById("img2").src = "";
    document.getElementById("t1").style.marginLeft = "10px";
    document.getElementById("sd4").style.backgroundColor = "#ffcc0000";
    document.getElementById("sd2").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd1").style.backgroundColor = "#ffcc001a";
    document.getElementById("sd3").style.backgroundColor = "#ffcc001a";
    document.getElementById("t1").textContent = `Welcome back to Devpoint! We're glad to see you again. Dive back into the community and continue exploring, sharing, and upvoting the resources that help you and others grow in competitive programming, web development, and beyond.

Your contributions and engagement make a difference here. Let’s keep the learning going and push the boundaries of what we can achieve together. Happy learning!`;
    document.getElementById("loginbut").style.display = "block";
    document.getElementById("signupbut").style.display = "none";
}

document.getElementById("loginbut").onclick = function () {
    window.location.href = "login.html";
}

document.getElementById("signupbut").onclick = function () {
    window.location.href = "auth.html";
}