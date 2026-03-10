// Account / Login logic
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

// Math dropdown logic
const mathLink = document.getElementById("math-link");
const mathOptions = document.getElementById("math-options");

mathLink.addEventListener("click", () => {
    mathOptions.style.display = (mathOptions.style.display === "flex") ? "none" : "flex";
});