import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserReviews, deleteReview, updateReview } from "../api/reviews";
import { getBookById } from "../api/googleBooks";
import { Review } from "../types/types";
import EditReviewForm from "../components/EditReviewForm";

const ProfilePage = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookTitles, setBookTitles] = useState<{ [key: string]: string }>({});
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem("token")!;
                const data = await getUserReviews(token);
                setReviews(data);
            } catch (error) {
                console.error("Kunde inte hämta användarens recensioner:", error);
            }
        };

        fetchUserReviews();
    }, [user]);

    useEffect(() => {
        const fetchBookTitles = async () => {
            const titles: { [key: string]: string } = {};

            for (const review of reviews) {
                if (!bookTitles[review.bookId]) {
                    try {
                        const bookData = await getBookById(review.bookId);
                        titles[review.bookId] = bookData.volumeInfo.title;
                    } catch (error) {
                        console.error("Kunde inte hämta bokinfo:", error);
                    }
                }
            }
            setBookTitles((prev) => ({ ...prev, ...titles }));
        };

        if (reviews.length > 0) {
            fetchBookTitles();
        }
    }, [reviews]);

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const token = localStorage.getItem("token")!;
            await deleteReview(reviewId, token);
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error("Kunde inte ta bort recension:", error);
        }
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setEditText(review.reviewText);
        setEditRating(review.rating);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;

        try {
            const token = localStorage.getItem("token")!;
            const updatedReview = await updateReview(editingReview._id, editText, editRating, token);

            setReviews(reviews.map((review) =>
                review._id === editingReview._id ? updatedReview : review
            ));

            setEditingReview(null);
        } catch (error) {
            console.error("Kunde inte uppdatera recension:", error);
        }
    };

    return (
        <div>
            <h1>Profil</h1>
            <h2>Välkommen, {user?.username}!</h2>

            <h3>Dina recensioner</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
                        <p><strong>Bok:</strong> {bookTitles[review.bookId] || "Laddar titel..."}</p>
                        <p><strong>Betyg:</strong> {review.rating} stjärnor</p>
                        <p>{review.reviewText}</p>
                        <p><small>{new Date(review.createdAt).toLocaleDateString()}</small></p>
                        <button onClick={() => handleEditReview(review)}>Redigera</button>
                        <button onClick={() => handleDeleteReview(review._id)}>Ta bort</button>
                    </div>
                ))
            ) : (
                <p>Du har inte skrivit några recensioner ännu.</p>
            )}

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
