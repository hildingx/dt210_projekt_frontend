interface Props {
    reviewText: string;
    setReviewText: (text: string) => void;
    rating: number;
    setRating: (rating: number) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ReviewForm = ({ reviewText, setReviewText, rating, setRating, onSubmit }: Props) => {
    return (
        <form onSubmit={onSubmit}>
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
    );
};

export default ReviewForm;
