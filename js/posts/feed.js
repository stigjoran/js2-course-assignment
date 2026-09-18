import { API_BASE_URL, API_KEY } from "../config.js";
import { getAuthHeaders } from "../api.js";

const postsContainer = document.getElementById("postsContainer");
const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");
const createPostForm = document.getElementById("createPostForm");
const createPostMessage = document.getElementById("createPostMessage");
const searchInput = document.getElementById("searchInput")
const myProfileLink = document.getElementById("myProfileLink");

myProfileLink.href = `profile.html?name=${encodeURIComponent(username)}`;

let allPosts = [];

async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts?_author=true`, {
           headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch posts"

            );
        }

        allPosts = data.data;
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

            const authorLink = document.createElement("a");
            authorLink.href = `profile.html?name=${encodeURIComponent(post.author.name)}`;
            authorLink.textContent = post.author.name || "Unknown author";

            author.appendChild(authorLink);

            const link = document.createElement("a");
            link.href = `post.html?id=${post.id}`;
            link.textContent = "View post";

            article.append(title, body, author, link);

            if (isOwnPost) {
                const editLink = document.createElement("a");
                editLink.href = `edit.html?id=${post.id}`;
                editLink.textContent = "Edit";

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async () => {
                    const deleted = await deletePost(post.id);
                    if (deleted) {
                        article.remove();
                    }
                });

                article.appendChild(editLink);
                article.appendChild(deleteButton);
            }

            postsContainer.appendChild(article);
        });
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredPosts = allPosts.filter((post) => {
            return (
                post.title?.toLowerCase().includes(searchTerm) ||
                post.body?.toLowerCase().includes(searchTerm)
            );
        });

        if (filteredPosts.length === 0) {
            postsContainer.textContent = "No posts found.";
            return;
        }

        displayPosts(filteredPosts);
    })


async function createPost(title, body) {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts`, {
            method: "POST",
                headers: {
                ...getAuthHeaders(),
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

async function deletePost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("Could not delete post");
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
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
