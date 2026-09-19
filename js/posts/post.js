import { API_BASE_URL, API_KEY } from "../config.js";
import { getAuthHeaders } from "../api.js";
import { requireAuth } from "../auth/logout.js";

requireAuth();

const postContainer = document.getElementById("postContainer");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function fetchPost() {
    try {
        const response = await fetch(
`${API_BASE_URL}/social/posts/${postId}?_author=true`,
{
    headers: getAuthHeaders(),
  }
);

const data = await response.json();

if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Could not fetch post"
 );
}

displayPost(data.data);

    } catch (error) {
        console.error(error);
    }
}

function displayPost(post) {
    postContainer.textContent = "";

    const title = document.createElement("h2");
    title.textContent = post.title || "Untitled post";

    const body = document.createElement("p");
    body.textContent = post.body || "";

    const author = document.createElement("p");
    author.textContent = `Author: ${post.author.name || "Unknown author"}`;

    postContainer.append(title, body, author);
}
    



fetchPost();