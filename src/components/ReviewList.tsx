import { Review } from "../types/types"
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./ReviewList.module.css";

interface Props {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onDelete: (reviewId: string) => void;
    bookTitles?: { [key: string]: string };
}

const renderStars = (rating: number) => "⭐".repeat(rating);

const ReviewList = ({ reviews, onEdit, onDelete, bookTitles }: Props) => {
    const { user } = useAuth();

    return (
        <div className={styles.reviewContainer}>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className={styles.reviewCard}>
                        {bookTitles ? (
                            <p className={styles.bookTitle}>
                                <strong>Bok:</strong>{" "}
                                <NavLink to={`/book/${review.bookId}`} className={styles.bookLink}>
                                    {bookTitles[review.bookId] || "Laddar titel..."}
                                </NavLink>
                            </p>
                        ) : (
                            <p className={styles.reviewUser}>
                                {review.userId?.username || "Okänd användare"} gav {review.rating} stjärnor {renderStars(review.rating)}
                            </p>
                        )}

                        {bookTitles && (
                            <p className={styles.reviewUser}>
                                Du gav {review.rating} stjärnor {renderStars(review.rating)}
                            </p>
                        )}

                        <p className={styles.reviewText}>{review.reviewText || "Ingen recensionstext."}</p>

                        <p className={styles.reviewDate}>
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Okänt datum"}
                        </p>

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
