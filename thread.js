// Account display
const accountArea = document.getElementById("account-area");
const username = localStorage.getItem("username") || "Guest";

if (localStorage.getItem("username")) {
    accountArea.innerHTML = `<span>👤 ${username}</span>`;
} else {
    accountArea.innerHTML = `<a href="login.html">Log in</a>`;
}

// Get thread ID
const params = new URLSearchParams(window.location.search);
const threadId = params.get("id");

let threads = JSON.parse(localStorage.getItem("threads") || "[]");
const thread = threads[threadId];

if (!thread) {
    document.body.innerHTML = "Thread not found.";
}

document.getElementById("thread-title").textContent = thread.title;
document.getElementById("thread-content").textContent = thread.content;

const postsContainer = document.getElementById("posts-container");

function renderPosts() {
    postsContainer.innerHTML = "";
    thread.posts.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("post");
        div.innerHTML = `
            <div class="author">${post.author}</div>
            <div class="content">${post.text}</div>
        `;
        postsContainer.appendChild(div);
    });
}

document.getElementById("reply-btn").addEventListener("click", () => {
    const text = document.getElementById("reply-input").value.trim();
    if (!text) return;

    thread.posts.push({ author: username, text });
    localStorage.setItem("threads", JSON.stringify(threads));

    document.getElementById("reply-input").value = "";
    renderPosts();
});

renderPosts();