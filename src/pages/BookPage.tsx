import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Hämta bok-id från URL
import { getBookById } from "../api/googleBooks"; // API-anrop för att hämta bokinfo
import { useAuth } from "../context/AuthContext"; // Hantera användarautentisering
import { getReviews, addReview, deleteReview, updateReview } from "../api/reviews"; // API för recensioner
import ReviewList from "../components/ReviewList"; // Komponent - lista recensioner
import ReviewForm from "../components/ReviewForm"; // Formulär - lägga till recension
import EditReviewForm from "../components/EditReviewForm"; // Formulär - redigera recension
import { Review } from "../types/types"; // Typdefinitioner
import styles from "./BookPage.module.css";

// Visar detaljer för specifik bok och dess recensioner
const BookPage = () => {
    // Hämta bok-id fårn url
    const { id } = useParams<{ id: string }>();

    // State för att lagra bokdata och recensioner
    const [book, setBook] = useState<any>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    // State för att hantera laddningsstatus
    const [loadingBook, setLoadingBook] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // State för att hantera recensioner
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);

    // State för redigering av rec
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    // Hämta aktuell användaren
    const { user } = useAuth();

    // Sanera HTML från API, hämta ren text
    const cleanHtml = (html: string): string => {
        const text = new DOMParser().parseFromString(html, "text/html");
        return text.body.textContent || "";
    };

    // Hämta bokinfo och recensioner vid sidladdning eller när id ändras
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

    // Hantera när ny recension läggs till
    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const token = localStorage.getItem("token")!;
            await addReview(id!, reviewText, rating, token);

            // Uppdatera recensionslista när ny lagts till
            const updatedReviews = await getReviews(id!);
            setReviews(updatedReviews);

            // Återställ formulär
            setReviewText("");
            setRating(5);
        } catch (error) {
            console.error("Kunde inte lägga till recension:", error);
        }
    };

    // Hantera borttagning av recension
    const handleDeleteReview = async (reviewId: string) => {
        if (!user) return;

        try {
            const token = localStorage.getItem("token")!;
            await deleteReview(reviewId, token);

            // Uppdatera recensionslista
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error("Kunde inte ta bort recension:", error);
        }
    };

    // Hantera uppdatering av recension
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview || !user) return;

        try {
            const token = localStorage.getItem("token")!;
            await updateReview(editingReview._id, editText, editRating, token);

            // Uppdatera recensionslista efter redigering
            const updatedReviews = await getReviews(id!);
            setReviews(updatedReviews);

            // Avsluta redigeringsläget
            setEditingReview(null);
        } catch (error) {
            console.error("Kunde inte uppdatera recension:", error);
        }
    };

    // Hantera aktivering av redigeringsläge för recension
    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setEditText(review.reviewText);
        setEditRating(review.rating);
    };

    // Visa laddningsmedd. om bok laddas
    if (loadingBook) return <p className={styles.loading}>Laddar bokinformation...</p>;

    // Om bok inte kan laddas
    if (!book || !book.volumeInfo) return <p className={styles.error}>Kunde inte ladda boken.</p>;

    return (
        <div className={styles.bookContainer}>
            <div className={styles.bookDetails}>
                {book.volumeInfo.imageLinks?.thumbnail && (
                    <img src={book.volumeInfo.imageLinks.medium} alt={book.volumeInfo.title} className={styles.bookImage} />
                )}
                <div className={styles.bookInfo}>
                    <h1>{book.volumeInfo.title}</h1>
                    <h3>{book.volumeInfo.authors?.join(", ")}</h3>
                    {/* Sanera beskrivning */}
                    <p>{cleanHtml(book.volumeInfo.description)}</p>
                </div>
            </div>
            <h2>Recensioner</h2>
            {/* Hämta recensioner */}
            {loadingReviews ? (
                <p className={styles.loading}>Laddar recensioner...</p>
            ) : (
                <ReviewList reviews={reviews} onEdit={handleEditReview} onDelete={handleDeleteReview} />
            )}

            <hr />

            {/* Visa redigeringsformulär om en recension redigeras annars vanligt formulär */}
            {editingReview ? (
                <EditReviewForm editText={editText} setEditText={setEditText} editRating={editRating} setEditRating={setEditRating} onSave={handleSaveEdit} onCancel={() => setEditingReview(null)} />
            ) : (
                user && <ReviewForm reviewText={reviewText} setReviewText={setReviewText} rating={rating} setRating={setRating} onSubmit={handleAddReview} />
            )}
        </div>
    );
};

export default BookPage;
