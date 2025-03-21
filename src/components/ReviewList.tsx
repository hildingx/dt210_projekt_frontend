import { Review } from "../types/types" // Importera typen för recensioner
import { useAuth } from "../context/AuthContext"; // Hämta info om inloggad användare
import { NavLink } from "react-router-dom";
import styles from "./ReviewList.module.css";

// Definiera props som komponent tar emot
interface Props {
    reviews: Review[]; // Array med recensioner
    onEdit: (review: Review) => void; // Funktion för att redigera recension
    onDelete: (reviewId: string) => void; // Funktion för att ta bort recension
    bookTitles?: { [key: string]: string }; // Optional prop
}

// Konvertera betyg till stjärnor
const renderStars = (rating: number) => "⭐".repeat(rating);

// Komponent för att visa lista med recensioner
// Om bookTitles finns är vi på profilsidan och visar användarens egna recensioner
const ReviewList = ({ reviews, onEdit, onDelete, bookTitles }: Props) => {
    const { user } = useAuth();

    return (
        <div className={styles.reviewContainer}>
            {/* Om det finns recensioner, skriv ut */}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className={styles.reviewCard}>
                        {/* Om bookTitles finns är användare på profilsidan och visar boktitel för respektive recension */}
                        {bookTitles ? (
                            <p className={styles.bookTitle}>
                                <strong>Bok:</strong>{" "}
                                <NavLink to={`/book/${review.bookId}`} className={styles.bookLink}>
                                    {bookTitles[review.bookId] || "Laddar titel..."}
                                </NavLink>
                            </p>
                        ) : (
                            // Om bookTitles inte finns är användare på boksida och visar användarnamn för respektive recension
                            <p className={styles.reviewUser}>
                                {review.userId?.username || "Okänd användare"} gav {review.rating} stjärnor {renderStars(review.rating)}
                            </p>
                        )}

                        {/* Om bookTitles finns skriv istället ut "Du" */}
                        {bookTitles && (
                            <p className={styles.reviewUser}>
                                Du gav {review.rating} stjärnor {renderStars(review.rating)}
                            </p>
                        )}

                        <p className={styles.reviewText}>{review.reviewText || "Ingen recensionstext."}</p>

                        <p className={styles.reviewDate}>
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Okänt datum"}
                        </p>

                        {/* Om användare äger recensionen, visa redigeringsknappar */}
                        {user && user._id === review.userId?._id && (
                            <div className={styles.buttonContainer}>
                                <button className={styles.reviewButton} onClick={() => onEdit(review)}>Redigera</button>
                                <button className={`${styles.reviewButton} ${styles.deleteButton}`} onClick={() => onDelete(review._id)}>Ta bort</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>Inga recensioner ännu.</p>
            )}
        </div>
    );
};

export default ReviewList;
