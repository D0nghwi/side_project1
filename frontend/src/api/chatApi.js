import apiClient from "./apiClient";

export const chatApi = {
    // POST /chat/
    send: (payload) => apiClient.post("/chat/", payload), 
};
