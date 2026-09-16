import { API_BASE_URL, API_KEY } from "../config.js";

const postsContainer = document.getElementById("postsContainer");
const accessToken = localStorage.getItem("accessToken");

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

    function displayPosts(posts) {
        postsContainer.textContent = "";

        posts.forEach((post) => {
            const article = document.createElement("article");

            const title = document.createElement("h3");
            title.textContent = post.title || "Untitled post";

            const body = document.createElement("p");
            body.textContent = post.body || "";

            const link = document.createElement("a");
            link.href = `post.html?id=${post.id}`;
            link.textContent = "View post";

            article.append(title, body, link);
            postsContainer.appendChild(article);

            const author = document.createElement("p");
            author.textContent = `Author: ${post.author.name || "Unknown author"}`;
            article.append(title, body, author, link);
        });
    }

} catch (error) {
    console.error(error);
}
}

fetchPosts();
