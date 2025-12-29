import apiClient from "./apiClient";

export const chatApi = {
    // POST /chat/
    send: (payload) =>{
        console.log("[chatApi] send payload:", payload);
        return apiClient.post("/chat/", payload);
    },
};
