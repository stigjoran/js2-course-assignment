import { API_BASE_URL, API_KEY } from "../config.js";

const accessToken = localStorage.getItem("accessToken");

const params = new URLSearchParams(window.location.search);
const username = params.get("name");

const profileName = document.getElementById("profileName");
const profileInfo = document.getElementById("profileInfo");
const profilePosts = document.getElementById("profilePosts");

function displayProfile(profileData) {
    profileName.textContent = profileData.name;

    const bio = document.createElement("p");
    bio.textContent = profileData.bio || "No bio";

    const followers = document.createElement("p");
    followers.textContent = `Followers: ${profileData._count.followers}`;

    const following = document.createElement("p");
    following.textContent = `Following: ${profileData._count.following}`;

    profileInfo.append(bio, followers, following);
}

async function fetchUserProfile() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/social/profiles/${username}`, 
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch profile"
            );
        }

        displayProfile(data.data);
    } catch (error) {
        console.error(error);
    }
}

function displayUserPosts(posts) {
    profilePosts.textContent = "";

    posts.forEach((post) => {
        const article = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = post.title || "Untitled post";

        const body = document.createElement("p");
        body.textContent = post.body || "";

        article.append(title, body);
        profilePosts.appendChild(article);

    });
    }

async function fetchUserPosts() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/social/profiles/${username}/posts`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": API_KEY
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch posts"
            );
        }
        
        displayUserPosts(data.data);
    } catch (error) {
        console.error(error);
    }
}

fetchUserProfile();
fetchUserPosts();