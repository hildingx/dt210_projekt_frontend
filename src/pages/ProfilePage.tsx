import { useEffect, useState } from "react"; // Hooks för state och sidladdning
import { useAuth } from "../context/AuthContext"; // Hämta användarinfo och autentisering
import { getUserReviews, deleteReview, updateReview } from "../api/reviews"; // API funktioner för recensioner
import { getBookById } from "../api/googleBooks"; // API funktion för hämta bokinformation google books
import { Review } from "../types/types"; // Typer
import ReviewList from "../components/ReviewList"; // Visa recensioner
import EditReviewForm from "../components/EditReviewForm"; // Formulär för redigering av recensioner
import styles from "./ProfilePage.module.css";

// Visa användarens profil och dess recensioner
const ProfilePage = () => {
    // Hämta inloggad användare från authContext
    const { user } = useAuth();

    // States för att hantera recensioner och boktitlar
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookTitles, setBookTitles] = useState<{ [key: string]: string }>({});
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    // Hämta alla recensioner som tillhör inloggad användare
    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!user) return; // Om ingen användare hittas, avbryt
            try {
                const token = localStorage.getItem("token")!;
                const data = await getUserReviews(token); // Hämta recensioner från API
                setReviews(data); // Uppdatera state med recensioner
            } catch (error) {
                console.error("Kunde inte hämta användarens recensioner:", error);
            }
        };

        fetchUserReviews();
    }, [user]); // Körs när user ändras

    // Hämta boktitlar för recensioner och lagra i bookTitles
    useEffect(() => {
        const fetchBookTitles = async () => {
            const titles: { [key: string]: string } = {}; // Tomt objekt för att lagra boktitlar

            // Iterera igenom varje review
            for (const review of reviews) {
                if (!bookTitles[review.bookId]) { // Om titeln inte finns i state
                    try {
                        const bookData = await getBookById(review.bookId); // Hämta bokinfo från API
                        titles[review.bookId] = bookData.volumeInfo.title; // Lägg till titel i objekt
                    } catch (error) {
                        console.error("Kunde inte hämta bokinfo:", error);
                    }
                }
            }
            setBookTitles((prev) => ({ ...prev, ...titles })); // Uppdatera state med de nya boktitlarna
        };

        if (reviews.length > 0) {
            fetchBookTitles();
        }
    }, [reviews]); // Körs när reviews ändras

    // Hantera delete av recension
    const handleDeleteReview = async (reviewId: string) => {
        try {
            const token = localStorage.getItem("token")!;
            await deleteReview(reviewId, token); // Ta bort recension via API
            setReviews(reviews.filter((review) => review._id !== reviewId)); // Uppdatera state utan borttagen recension
        } catch (error) {
            console.error("Kunde inte ta bort recension:", error);
        }
    };

    // Hantera redigering av recension
    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setEditText(review.reviewText);
        setEditRating(review.rating);
    };

    // Hantera sparande av recension
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;

        try {
            const token = localStorage.getItem("token")!;
            const updatedReview = await updateReview(editingReview._id, editText, editRating, token);

            // Uppdatera lista av recensioner med den redigerade recensionen
            setReviews(reviews.map((review) =>
                review._id === editingReview._id ? updatedReview : review
            ));

            setEditingReview(null); // Stäng redigeringsforumlär
        } catch (error) {
            console.error("Kunde inte uppdatera recension:", error);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h1>Välkommen, {user?.username}!</h1>

            <h2>Dina recensioner</h2>
            {/* Lista med användarens recensioner */}
            <ReviewList
                reviews={reviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                bookTitles={bookTitles}
            />

            {/* Redigeringsformulär för recensioner */}
            {editingReview && (
                <EditReviewForm
                    editText={editText}
                    setEditText={setEditText}
                    editRating={editRating}
                    setEditRating={setEditRating}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingReview(null)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
