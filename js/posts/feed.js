import { API_BASE_URL, API_KEY } from "../config.js";

const postsContainer = document.getElementById("postsContainer");
const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");
const createPostForm = document.getElementById("createPostForm");
const createPostMessage = document.getElementById("createPostMessage");

async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts?_author=true`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch posts"

            );
        }

    displayPosts(data.data);
    } catch (error) {
        console.error(error);
    }
}

    function displayPosts(posts) {
        postsContainer.textContent = "";

        posts.forEach((post) => {
            const article = document.createElement("article");

            const isOwnPost = post.author.name === username;

            const title = document.createElement("h3");
            title.textContent = post.title || "Untitled post";

            const body = document.createElement("p");
            body.textContent = post.body || "";

            const author = document.createElement("p");
            author.textContent = 
            `Author: ${post.author.name || "Unknown author"}`;

            const link = document.createElement("a");
            link.href = `post.html?id=${post.id}`;
            link.textContent = "View post";

            if (isOwnPost) {
                const editLink = document.createElement("a");
                editLink.href = `edit.html?id=${post.id}`;
                editLink.textContent = "Edit";
                article.appendChild(editLink);
            }

            article.append(title, body, link);
            postsContainer.appendChild(article);
        });
    }


async function createPost(title, body) {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not create post");
        }

        createPostForm.reset();
        await fetchPosts();
    } catch (error) {
        console.error(error);
    }
}

createPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(createPostForm);

    const title = formData.get("title");
    const body = formData.get("body");

    if (!title.trim()) {
        createPostMessage.textContent = "Title is required.";
        return;
    }

    console.log("Title:", title);
    console.log("Body:", body);
    await createPost(title, body);
});

fetchPosts();
