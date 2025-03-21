// Definiera props som komponent tar emot
interface Props {
    editText: string;
    setEditText: (text: string) => void;
    editRating: number;
    setEditRating: (rating: number) => void;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
}

// Komponent för att redigera recension
const EditReviewForm = ({ editText, setEditText, editRating, setEditRating, onSave, onCancel }: Props) => {
    return (
        // Formulär för att redigera recension
        <form onSubmit={onSave}>
            <h3>Redigera recension</h3>
            <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                required
            />
            <label>
                Betyg:
                <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </label>
            <button type="submit">Spara ändringar</button>
            <button type="button" onClick={onCancel}>Avbryt</button>
        </form>
    );
};

export default EditReviewForm;
