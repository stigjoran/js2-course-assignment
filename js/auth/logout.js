export function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");

    window.location.href = "index.html";
}

export function requireAuth() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "index.html";
    }
}