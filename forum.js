document.addEventListener("DOMContentLoaded", function () {

  const threadList = document.getElementById("threadList");
  const threadContent = document.getElementById("threadContent");
  const newTopicBtn = document.getElementById("newTopicBtn");
  const modal = document.getElementById("topicModal");
  const closeModal = document.getElementById("closeModal");
  const postTopic = document.getElementById("postTopic");
  const emojis = document.querySelectorAll(".emoji");
  const textarea = document.getElementById("topicText");

  let threads = JSON.parse(localStorage.getItem("threads")) || [];

  function save() {
    localStorage.setItem("threads", JSON.stringify(threads));
  }

  function renderThreads() {
    threadList.innerHTML = "";
    threads.forEach(thread => {
      const div = document.createElement("div");
      div.className = "thread-item";
      div.innerHTML = `<strong>${thread.title}</strong><br>
                       <small>${thread.posts.length} posts</small>`;
      div.onclick = () => {
        document.querySelectorAll(".thread-item")
          .forEach(t => t.classList.remove("active"));
        div.classList.add("active");
        openThread(thread.id);
      };
      threadList.appendChild(div);
    });
  }

  function openThread(id) {
    const thread = threads.find(t => t.id === id);

    threadContent.innerHTML = "";

    thread.posts.forEach(post => {
      const box = document.createElement("div");
      box.className = "post-box";
      box.innerHTML = `
        <div class="post-author">${post.author}</div>
        <div class="post-content">${post.content}</div>
      `;
      threadContent.appendChild(box);
    });

    const replyArea = document.createElement("textarea");
    replyArea.placeholder = "Write a reply...";
    replyArea.style.width = "100%";
    replyArea.style.marginTop = "10px";

    const replyBtn = document.createElement("button");
    replyBtn.textContent = "Reply";
    replyBtn.style.marginTop = "8px";

    replyBtn.onclick = () => {
      if (!replyArea.value.trim()) return;
      thread.posts.push({
        author: "User",
        content: replyArea.value
      });
      save();
      openThread(id);
      renderThreads();
    };

    threadContent.appendChild(replyArea);
    threadContent.appendChild(replyBtn);
  }

  newTopicBtn.onclick = () => modal.style.display = "block";
  closeModal.onclick = () => modal.style.display = "none";

  emojis.forEach(e => {
    e.onclick = () => textarea.value += e.textContent;
  });

  postTopic.onclick = () => {
    const title = document.getElementById("topicTitle").value;
    const content = textarea.value;

    if (!title.trim() || !content.trim()) return;

    threads.unshift({
      id: Date.now(),
      title,
      posts: [{
        author: "User",
        content
      }]
    });

    save();
    renderThreads();
    modal.style.display = "none";
    document.getElementById("topicTitle").value = "";
    textarea.value = "";
  };

  renderThreads();

});