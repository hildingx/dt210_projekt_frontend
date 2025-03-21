import { useState } from "react"; // Hook för state
import { searchBooks } from "../api/googleBooks"; // API-anrop till googlebooks
import { Link } from "react-router-dom"; // För att länka till boksidor med bokid
import styles from "./HomePage.module.css";

// 
const HomePage = () => {
    // States för sökfråga, sökresultat, och laddningsstatus
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hantera sökningen
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault(); // Undvik sidomladdning vid submit
        if (query.trim() === "") return; // Undvik tomma söksträngar

        setHasSearched(true); // Markera att sökning gjorts
        setLoading(true); // Starta laddningsindikator
        setBooks([]); // Rensa tidigare sökresultat

        // Skicka sökförfrågan till google books api
        const results = await searchBooks(query);
        setBooks(results); // Uppdatera state med sökresultat
        setLoading(false); // Stäng laddningsindikator
    };

    return (
        <div className="home-page">
            <h1>Sök efter böcker</h1>

            {/* Sökformulär*/}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Skriv in en boktitel eller författare..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Sök</button>
            </form>

            {loading && <p className={styles.loading}>Laddar...</p>}

            {/* Sökresultat*/}
            <div className={styles.bookGrid}>
                {!loading && hasSearched && books.length === 0 ? (
                    <p className={styles.noResults}>Inga resultat</p>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className={styles.bookCard}>
                            {book.volumeInfo.imageLinks?.thumbnail ? (
                                <img
                                    src={book.volumeInfo.imageLinks.thumbnail}
                                    alt={book.volumeInfo.title}
                                    className={styles.bookImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>Ingen bild</div>
                            )}
                            <div className={styles.bookInfo}>
                                <h3 className={styles.bookTitle}>{book.volumeInfo.title}</h3>
                                <p className={styles.bookAuthor}>Av: {book.volumeInfo.authors?.join(", ") || "Okänd"}</p>
                                <Link to={`/book/${book.id}`} className={styles.bookLink}>Läs mer</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;

