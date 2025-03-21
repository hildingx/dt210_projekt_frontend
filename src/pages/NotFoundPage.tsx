import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Sidan hittades inte</h1>
            <p>Oj! Sidan du söker finns inte.</p>
            <Link to="/">Tillbaka till startsidan</Link>
        </div>
    );
}