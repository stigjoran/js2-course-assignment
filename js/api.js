import { API_KEY } from "./config.js";

export function getAuthHeaders() {
    const accessToken = localStorage.getItem("accessToken");

    return {
        Authorization: `Bearer ${accessToken}`,
                        "X-Noroff-API-Key": API_KEY
                    };
                }