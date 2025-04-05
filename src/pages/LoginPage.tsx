import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

// Hantera inloggning av användare
const LoginPage = () => {
    // States för hantering av inloggningsuppgifter och felmedd.
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Hämta loginfunktion från authContext
    const { login } = useAuth();
    const navigate = useNavigate();

    // Hantera inloggningsformulär
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Förhindra omladdning av sida

        // Kontrollera input
        if (!username || !password) {
            setError("Användarnamn och lösenord krävs");
            return;
        }

        setIsLoading(true); // Starta laddningsindikator

        try {
            await login({ username, password }); // Skicka inloggningsuppgifter till authcontext
            navigate("/profile"); // Vid lyckad inloggning skicka användare till /profile
        } catch (err: any) {
            setError(err.response?.data?.message || "Inloggning misslyckades");
        } finally {
            setIsLoading(false); // Avsluta laddningsindikator oavsett om det lyckas eller ej
        }
    };

    return (
        <div className="form">
            <h1>Logga in</h1>
            {/* Visa ev felmeddelande */}
            {error && <p className="error-message">{error}</p>}

            {/* Inloggningsformulär */}
            <form onSubmit={handleLogin}>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loggar in..." : "Logga in"}
                </button>
            </form>

            <p className="register-link">
                Inget konto? <NavLink to="/register">Registrera dig här</NavLink>
            </p>

            {isLoading && <p className="loading">Loggar in...</p>}
        </div>
    );
};

export default LoginPage;

