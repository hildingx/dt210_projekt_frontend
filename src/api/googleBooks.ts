import axios from "axios";

const API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export const searchBooks = async (query: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}?q=${query}&key=${API_KEY}`);
        return response.data.items || [];
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
};

export const getBookById = async (bookId: string) => {
    if (!bookId) return null;
    try {
        const response = await axios.get(`${API_BASE_URL}/${bookId}?key=${API_KEY}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn("Google Books API: För många förfrågningar. Försök igen senare.");
        } else {
            console.error("Kunde inte hämta bokdata:", error);
        }
        return null; // Returnera `null` om vi får ett fel
    }
};