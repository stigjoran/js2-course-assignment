import { API_BASE_URL, API_KEY } from "../config.js";
import { getAuthHeaders } from "../api.js";
import { requireAuth } from "../auth/logout.js";

requireAuth();

const loggedInUsername = localStorage.getItem("username");

const params = new URLSearchParams(window.location.search);
const username = params.get("name")  || loggedInUsername;

const profileName = document.getElementById("profileName");
const profileInfo = document.getElementById("profileInfo");
const profilePosts = document.getElementById("profilePosts");
const followButton = document.getElementById("followButton");
const myProfileLink = document.getElementById("myProfileLink");

myProfileLink.href = `profile.html?name=${encodeURIComponent(loggedInUsername)}`;

if (username === loggedInUsername) {
    followButton.hidden = true;
}

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

async function fetchFollowState() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/social/profiles/${loggedInUsername}?_following=true`,
            {
                headers: getAuthHeaders(),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch follow state");
        }

        const isFollowing = data.data.following.some(
            (profile) => profile.name === username
        );

        followButton.textContent = isFollowing ? "Unfollow" : "Follow";

    } catch (error) {
        console.error(error);
    }
}




async function followUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/social/profiles/${username}/follow`, {
            method: "PUT",
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not follow user");
        }

        followButton.textContent = "Unfollow";

    } catch (error) {
        console.error(error);
    }
}

async function unfollowUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/social/profiles/${username}/unfollow`, {
            method: "PUT",
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not unfollow user");
        }

        followButton.textContent = "Follow";

    } catch (error) {
        console.error(error);
    }
}

followButton.addEventListener("click", async () => {
    if (followButton.textContent === "Follow") {
        await followUser();
    } else {
        await unfollowUser();
        }
    });


async function fetchUserProfile() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/social/profiles/${username}`, 
            {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Could not fetch profile"
            );
        }

        console.log("Profile:", data.data);

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
                headers: getAuthHeaders(),
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
fetchFollowState();