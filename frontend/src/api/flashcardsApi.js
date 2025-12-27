import apiClient from "./apiClient";

export const flashcardsApi = {
    // POST /flashcards/flashcards/generate
    generate: (payload) => apiClient.post("/flashcards/flashcards/generate", payload),
    // GET /flashcards/decks
    listDecks: () => apiClient.get("/flashcards/decks"),
    // POST /flashcards/decks
    createDeck: (payload) => apiClient.post("/flashcards/decks", payload),
    // GET /flashcards/decks/{deck_id}
    getDeck: (deckId) => apiClient.get(`/flashcards/decks/${deckId}`),
    // DELETE /flashcards/decks/${deckId}
    removeDeck: (deckId) => apiClient.delete(`/flashcards/decks/${deckId}`),
};
