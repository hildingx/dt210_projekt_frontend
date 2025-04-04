import React, { useState } from "react"; // Hooks för state
import { useNavigate, NavLink } from "react-router-dom"; // Navigering
import axios from "axios";
import { LoginCredentials } from "../types/types";

// Hantera registering av ny användare
const RegisterPage = () => {
    // State för inmatningsfält och felmedd.
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const credentials: LoginCredentials = { username, password };

    const navigate = useNavigate(); // React router nav
    const API_URL = "https://dt210g-projekt-backend-qh0z.onrender.com/api";

    // Hantera registering när forumlär skickas
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validering av input
        if (!username.trim() || !password.trim()) {
            setError("Ange ett användarnamn och lösenord för att registrera dig.");
            return;
        }

        if (username.length < 3) {
            setError("Användarnamnet måste vara minst 3 tecken långt.");
            return;
        }

        if (password.length < 4) {
            setError("Lösenordet måste vara minst 4 tecken långt.");
            return;
        }

        try {
            // Skicka inloggningsuppgifter till API
            await axios.post<void>(`${API_URL}/auth/register`, credentials);

            alert("Ditt konto har registrerats. Du kan nu logga in.");

            navigate("/login"); // Omdirigera till /login
        } catch (err: any) {
            setError(err.response?.data?.message || "Registrering misslyckades");
        }
    };

    return (
        <div className="form">
            <h1>Registrera konto</h1>
            {/* Visa ev felmeddelande */}
            {error && <p className="error-message">{error}</p>}

            {/* Registreringsformulär */}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Registrera</button>
            </form>
            <p className="register-link">
                Har du redan ett konto? <NavLink to="/login">Logga in här</NavLink>
            </p>
        </div>
    );
};

export default RegisterPage;

