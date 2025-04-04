import { createContext, useContext, useEffect, useState } from "react"; // React context API och hooks
import { User, LoginCredentials, AuthContextType, AuthResponse } from "../types/types"; // Importera typer
import axios from "axios";

// Global context för autentisering
const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = "https://dt210g-projekt-backend-qh0z.onrender.com/api";

// Komponent som hanterar autentisering 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // State som håller information om inloggad användare
    const [user, setUser] = useState<User | null>(null);
    // State som anger om vi laddar in användarens information
    const [loading, setLoading] = useState(true);

    // Hämtar och validerar använaren från API vid sidladdning
    // Om token finns validera mot backend
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get(`${API_URL}/auth/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user); // Sätter användare i state om token är giltig
            } catch (error) {
                console.error("Kunde inte validera token:", error);
                logout(); // Ogiltig token = logga ut användare
            }
        }
        setLoading(false); // Avslutar laddningen
    };

    // Kör fetchUser vid sidladdning
    useEffect(() => {
        fetchUser();
    }, []);

    // Skicka inloggningsuppgifter till API'et och lagra token vid lyckad inloggning
    const login = async (credentials: LoginCredentials) => { // LoginCredentials = användarnamn och lösenord
        const res = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user); // Sätter användaren i state
    };

    // Logga ut användare. Tar bort token, rensar state.
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // Returnerar providern så alla barnkomponenter får åtkomst till user, login, logout och loading.
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext) as AuthContextType;
};
