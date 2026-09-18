import { API_BASE_URL, API_KEY } from "../config.js";
import { getAuthHeaders } from "../api.js";
import { requireAuth } from "../auth/logout.js";

requireAuth();

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const accessToken = localStorage.getItem("accessToken");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");

const editPostForm = document.getElementById("editPostForm");

async function fetchPost() {

    try {
        const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch post"
            );
        }

        titleInput.value = data.data.title || "";
        bodyInput.value = data.data.body || ""; 
    } catch (error) {
        console.error(error);
    }
}

async function updatePost(title, body) {
    try {
        const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
                "content-Type": "application/json",
            },
            body: JSON.stringify({ title, body })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not update post");
        }

        window.location.href = `post.html?id=${postId}`;
    } catch (error) {
        console.error(error);
    }
}

editPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const body = bodyInput.value;

    await updatePost(title, body);
});

fetchPost();
