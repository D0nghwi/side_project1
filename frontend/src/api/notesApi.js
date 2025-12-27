import apiClient from "./apiClient";

export const notesApi = {
    // GET /notes/
    list: (params) => apiClient.get("/notes/", { params }),
    // POST /notes/          
    create: (payload) => apiClient.post("/notes/", payload),
    // GET /notes/{note_id}         
    get: (noteId) => apiClient.get(`/notes/${noteId}`),              
    // PUT /notes/{note_id}
    update: (noteId, payload) => apiClient.put(`/notes/${noteId}`, payload),
    // DELETE /notes/{note_id}
    remove: (noteId) => apiClient.delete(`/notes/${noteId}`),        
};
