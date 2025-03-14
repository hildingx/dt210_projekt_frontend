import { useState } from "react";
import { searchBooks } from "../api/googleBooks";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim() === "") return;

        setHasSearched(true);
        setLoading(true);
        setBooks([]);

        const results = await searchBooks(query);
        setBooks(results);
        setLoading(false);
    };

    return (
        <div className="home-page">
            <h1>Sök efter böcker</h1>
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

