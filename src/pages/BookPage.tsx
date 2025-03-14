import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../api/googleBooks";
import { useAuth } from "../context/AuthContext";
import { getReviews, addReview, deleteReview, updateReview } from "../api/reviews";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import EditReviewForm from "../components/EditReviewForm";
import { Review } from "../types/types";
import styles from "./BookPage.module.css";

const BookPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingBook, setLoadingBook] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);
    const { user } = useAuth();

    const cleanHtml = (html: string): string => {
        const text = new DOMParser().parseFromString(html, "text/html");
        return text.body.textContent || "";
    };

    useEffect(() => {
        const fetchBook = async () => {
            setLoadingBook(true);
            const data = await getBookById(id!);
            setBook(data);
            setLoadingBook(false);
        };

        const fetchReviews = async () => {
            setLoadingReviews(true);
            const data = await getReviews(id!);
            setReviews(data);
            setLoadingReviews(false);
        };

        fetchBook();
        fetchReviews();
    }, [id]);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const token = localStorage.getItem("token")!;
            await addReview(id!, reviewText, rating, token);

            const updatedReviews = await getReviews(id!);
            setReviews(updatedReviews);

            setReviewText("");
            setRating(5);
        } catch (error) {
            console.error("Kunde inte lägga till recension:", error);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!user) return;

        try {
            const token = localStorage.getItem("token")!;
            await deleteReview(reviewId, token);
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error("Kunde inte ta bort recension:", error);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview || !user) return;

        try {
            const token = localStorage.getItem("token")!;
            await updateReview(editingReview._id, editText, editRating, token);

            const updatedReviews = await getReviews(id!);
            setReviews(updatedReviews);

            setEditingReview(null);
        } catch (error) {
            console.error("Kunde inte uppdatera recension:", error);
        }
    };

    if (loadingBook) return <p className={styles.loading}>Laddar bokinformation...</p>;
    if (!book || !book.volumeInfo) return <p className={styles.error}>Kunde inte ladda boken.</p>;

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setEditText(review.reviewText);
        setEditRating(review.rating);
    };

    return (
        <div className={styles.bookContainer}>
            <div className={styles.bookDetails}>
                {book.volumeInfo.imageLinks?.thumbnail && (
                    <img src={book.volumeInfo.imageLinks.medium} alt={book.volumeInfo.title} className={styles.bookImage} />
                )}
                <div className={styles.bookInfo}>
                    <h1>{book.volumeInfo.title}</h1>
                    <h3>{book.volumeInfo.authors?.join(", ")}</h3>
                    <p>{cleanHtml(book.volumeInfo.description)}</p>
                </div>
            </div>
            <h2>Recensioner</h2>
            {loadingReviews ? (
                <p className={styles.loading}>Laddar recensioner...</p>
            ) : (
                <ReviewList reviews={reviews} onEdit={handleEditReview} onDelete={handleDeleteReview} />
            )}

            <hr />

            {editingReview ? (
                <EditReviewForm editText={editText} setEditText={setEditText} editRating={editRating} setEditRating={setEditRating} onSave={handleSaveEdit} onCancel={() => setEditingReview(null)} />
            ) : (
                user && <ReviewForm reviewText={reviewText} setReviewText={setReviewText} rating={rating} setRating={setRating} onSubmit={handleAddReview} />
            )}
        </div>
    );
};

export default BookPage;
