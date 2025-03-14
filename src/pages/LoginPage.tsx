import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Användarnamn och lösenord krävs");
            return;
        }

        try {
            await login({ username, password });
            navigate("/profile");
        } catch (err: any) {
            setError(err.response?.data?.message || "Inloggning misslyckades");
        }
    };

    return (
        <div className="form">
            <h1>Logga in</h1>
            {error && <p className="error-message">{error}</p>}
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
                <button type="submit">Logga in</button>
            </form>

            <p className="register-link">
                Inget konto? <NavLink to="/register">Registrera dig här</NavLink>
            </p>
        </div>
    );
};

export default LoginPage;

