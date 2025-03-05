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
    try {
        const response = await axios.get(`${API_BASE_URL}/${bookId}?key=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book details:", error);
        return null;
    }
};