import { API_BASE_URL } from "../config.js";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
    const formData = new FormData(registerForm);

    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password");

    const userData = {
        name,
        email,
        password,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.[0]?.message || "Registration failed"
        );
    }

    message.textContent = "Registration successful!";
    registerForm.reset();

} catch (error) {
    message.textContent = error.message;
    console.error(error);
    }
});

