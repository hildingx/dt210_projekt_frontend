import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const API_URL = "http://localhost:5000/api";

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username,
                password,
            });

            alert("Ditt konto har registrerats. Du kan nu logga in.");

            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registrering misslyckades");
        }
    };

    return (
        <div className="form">
            <h1>Registrera konto</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
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

