// Hanterar API-anrop för recensioner med Axios

import axios from "axios";
import { Review } from "../types/types"

const API_URL = "https://dt210g-projekt-backend-qh0z.onrender.com/api/reviews";

// Hämta alla recensioner för en specifik bok med det unika ID't för boken
export const getReviews = async (bookId: string) => {
    try {
        // GET-förfrågan för att hämta recensioner kopplade till bokID't
        const res = await axios.get(`${API_URL}/${bookId}`);
        return res.data;
    } catch (error) {
        console.error("Kunde inte hämta recensioner:", error);
        return [];
    }
};

// Lägg till ny recension för en bok
export const addReview = async (bookId: string, reviewText: string, rating: number, token: string) => {
    try {
        // POST-förfrågan för att skapa en ny recension
        const res = await axios.post(
            API_URL,
            { bookId, reviewText, rating },
            { headers: { Authorization: `Bearer ${token}` } } // Inkluderar JWT-token i headern
        );
        return res.data;
    } catch (error) {
        console.error("Kunde inte lägga till recension:", error);
        throw error;
    }
};

// Ta bort recension
export const deleteReview = async (reviewId: string, token: string) => {
    try {
        await axios.delete(`${API_URL}/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Kunde inte ta bort recension:", error);
        throw error;
    }
};


// Uppdatera recension
export const updateReview = async (reviewId: string, reviewText: string, rating: number, token: string) => {
    try {
        const res = await axios.put(
            `${API_URL}/${reviewId}`,
            { reviewText, rating },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (error) {
        console.error("Kunde inte uppdatera recension:", error);
        throw error;
    }
};

// Hämta alla recensioner från specifik användare
export const getUserReviews = async (token: string): Promise<Review[]> => {
    try {
        const res = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Kunde inte hämta användarens recensioner:", error);
        return [];
    }
};

