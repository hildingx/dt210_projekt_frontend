import { useState } from "react";
import { searchBooks } from "../api/googleBooks";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim() === "") return;

        setHasSearched(true);
        const results = await searchBooks(query);
        setBooks(results);
    };

    return (
        <div>
            <h1>Sök efter böcker</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Skriv in en boktitel..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Sök</button>
            </form>

            <div>
                {books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id}>
                            <h3>{book.volumeInfo.title}</h3>
                            <p>{book.volumeInfo.authors?.join(", ")}</p>
                            <Link to={`/book/${book.id}`}>Läs mer</Link>
                        </div>
                    ))
                ) : (
                    hasSearched && <p>Inga resultat</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;

