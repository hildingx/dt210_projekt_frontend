import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../api/googleBooks";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface Review {
    _id: string;
    userId: { _id: string; username: string };
    reviewText: string;
    rating: number;
    createdAt: string;
}

const BookPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const { user } = useAuth();

    const cleanHtml = (html: string): string => {
        const text = new DOMParser().parseFromString(html, "text/html");
        return text.body.textContent || "";
    };

    useEffect(() => {
        const fetchBook = async () => {
            const data = await getBookById(id!);
            setBook(data);
        };

        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews/${id}`);
                setReviews(res.data);
            } catch (error) {
                console.error("Kunde inte hämta recensioner:", error);
            }
        };

        fetchBook();
        fetchReviews();
    }, [id]);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${API_URL}/reviews`,
                { bookId: id, reviewText, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviews([...reviews, res.data]);
            setReviewText("");
            setRating(5);
        } catch (error) {
            console.error("Kunde inte lägga till recension:", error);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!user) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error("Kunde inte ta bort recension:", error);
        }
    };

    if (!book) return <p>Laddar...</p>;

    return (
        <div>
            <h1>{book.volumeInfo.title}</h1>
            <h3>{book.volumeInfo.authors?.join(", ")}</h3>
            <p>{cleanHtml(book.volumeInfo.description)}</p>
            {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            )}

            {/* Recensionssektion */}
            <h2>Recensioner</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
                        <p><strong>{review.userId.username}</strong> gav {review.rating} stjärnor</p>
                        <p>{review.reviewText}</p>
                        <p><small>{new Date(review.createdAt).toLocaleDateString()}</small></p>
                        {user && user.id === review.userId._id && (
                            <button onClick={() => handleDeleteReview(review._id)}>Ta bort</button>
                        )}
                    </div>
                ))
            ) : (
                <p>Inga recensioner ännu.</p>
            )}

            {/* Formulär för att lägga till recension */}
            {user ? (
                <form onSubmit={handleAddReview}>
                    <h3>Skriv en recension</h3>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Vad tyckte du om boken?"
                        required
                    />
                    <label>
                        Betyg:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">Lägg till recension</button>
                </form>
            ) : (
                <p><strong>Logga in för att skriva en recension.</strong></p>
            )}
        </div>
    );
};

export default BookPage;
