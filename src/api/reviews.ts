import axios from "axios";
import { Review } from "../types/types"

const API_URL = "http://localhost:5000/api/reviews";

export const getReviews = async (bookId: string) => {
    try {
        const res = await axios.get(`${API_URL}/${bookId}`);
        return res.data;
    } catch (error) {
        console.error("Kunde inte hämta recensioner:", error);
        return [];
    }
};

export const addReview = async (bookId: string, reviewText: string, rating: number, token: string) => {
    try {
        const res = await axios.post(
            API_URL,
            { bookId, reviewText, rating },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (error) {
        console.error("Kunde inte lägga till recension:", error);
        throw error;
    }
};

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

export const getUserReviews = async (token: string): Promise<Review[]> => {
    const res = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
