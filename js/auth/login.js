import { API_BASE_URL } from "../config.js";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

    const formData = new FormData(loginForm);

    const email = formData.get("email").trim();
    const password = formData.get("password");

    const loginData = {
        email,
        password,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.errors?.[0]?.message || "Login failed"
            );
        }

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("username", data.data.name);
        message.textContent = "Login successful!";

        window.location.href = "feed.html";


    } catch (error) {
        message.textContent = error.message;
        console.error(error);
    }
});