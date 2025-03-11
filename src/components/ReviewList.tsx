import { Review } from "../types/types"
import { useAuth } from "../context/AuthContext";

interface Props {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onDelete: (reviewId: string) => void;
}

const ReviewList = ({ reviews, onEdit, onDelete }: Props) => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Recensioner</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
                        <p><strong>{review.userId.username}</strong> gav {review.rating} stjärnor</p>
                        <p>{review.reviewText}</p>
                        <p><small>{new Date(review.createdAt).toLocaleDateString()}</small></p>
                        {user && user._id === review.userId._id && (
                            <>
                                <button onClick={() => onEdit(review)}>Redigera</button>
                                <button onClick={() => onDelete(review._id)}>Ta bort</button>
                            </>
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
