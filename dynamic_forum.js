// ------------------ Account / Login logic ------------------
const accountArea = document.getElementById("account-area");
const username = localStorage.getItem("username");

if (username) {
    accountArea.innerHTML = `
        <div class="account-dropdown">
            <span onclick="toggleDropdown()">👤 ${username} ▼</span>
            <div class="dropdown-content" id="dropdownMenu">
                <a href="#">Profile</a>
                <a href="#">Account</a>
                <a href="#" onclick="logout()">Log Out</a>
            </div>
        </div>
    `;
} else {
    accountArea.innerHTML = `
        <a href="login.html">Log in</a>
        <a href="registration.html">Sign up</a>
    `;
}

function logout() {
    localStorage.removeItem("username");
    window.location.reload();
}

function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}

window.addEventListener("click", function (event) {
    if (!event.target.closest(".account-dropdown")) {
        const dropdown = document.getElementById("dropdownMenu");
        if (dropdown) dropdown.classList.remove("show");
    }
});

// ------------------ Forum Logic ------------------
const threadsContainer = document.getElementById("threads-container");
const createThreadBtn = document.getElementById("create-thread-btn");

createThreadBtn.addEventListener("click", () => {
    const titleInput = document.getElementById("new-thread-title");
    const contentInput = document.getElementById("new-thread-content");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) return alert("Please enter both title and problem content.");

    const threadDiv = document.createElement("div");
    threadDiv.classList.add("thread");

    threadDiv.innerHTML = `
        <div class="thread-title">${title}</div>
        <div class="thread-content">${content}</div>
        <div class="posts"></div>
        <textarea class="post-input" placeholder="Write your solution or discussion..."></textarea>
        <button class="post-btn">Post</button>
    `;

    threadsContainer.prepend(threadDiv);

    // Add post functionality for this thread
    const postBtn = threadDiv.querySelector(".post-btn");
    const postInput = threadDiv.querySelector(".post-input");
    const postsDiv = threadDiv.querySelector(".posts");

    postBtn.addEventListener("click", () => {
        const postText = postInput.value.trim();
        if (!postText) return;

        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `<div class="author">${username || "Guest"}</div><div class="content">${postText}</div>`;

        postsDiv.appendChild(postDiv);
        postInput.value = "";
    });

    // Clear thread creation inputs
    titleInput.value = "";
    contentInput.value = "";
});