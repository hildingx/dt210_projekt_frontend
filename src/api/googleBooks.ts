// Hanterar API-anrop till Google Books API med Axios

import axios from "axios";

// Bas-URL för Google Books API
const API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

// API-nyckel hämtad från miljövariabel
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// Sök efter böcker i Google Books API
export const searchBooks = async (query: string) => {
    try {
        // GET-förfrågan till Google Books API med söksträng
        const response = await axios.get(`${API_BASE_URL}?q=${query}&key=${API_KEY}`);

        // Returnera lista med böcker om resultat finns, annars en tom array
        return response.data.items || [];
    } catch (error) {
        console.error("Error fetching books:", error);
        return []; // Returnera en tom array vid fel
    }
};

// Hämta detaljerad information om en specifik bok från Google Books API
export const getBookById = async (bookId: string) => {
    if (!bookId) return null; // Returnera null om inget ID skickas in

    try {
        // GET-förfrågan för att hämta bokens detaljer
        const response = await axios.get(`${API_BASE_URL}/${bookId}?key=${API_KEY}`);

        return response.data; // Returnera bokobjektet
    } catch (error: any) {
        // Hantering av för många API-anrop
        if (error.response?.status === 429) {
            console.warn("Google Books API: För många förfrågningar. Försök igen senare.");
        } else {
            console.error("Kunde inte hämta bokdata:", error);
        }
        return null; // Returnera `null` om vi får ett fel
    }
};