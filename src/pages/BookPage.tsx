import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../api/googleBooks";

const BookPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);

    const cleanHtml = (html: string): string => {
        const text = new DOMParser().parseFromString(html, "text/html");
        return text.body.textContent || "";
    };

    useEffect(() => {
        const fetchBook = async () => {
            const data = await getBookById(id!);
            setBook(data);
        };
        fetchBook();
    }, [id]);

    if (!book) return <p>Laddar...</p>;

    return (
        <div>
            <h1>{book.volumeInfo.title}</h1>
            <h3>{book.volumeInfo.authors?.join(", ")}</h3>
            <p>{cleanHtml(book.volumeInfo.description)}</p>
            {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            )}
        </div>
    );
};

export default BookPage;

