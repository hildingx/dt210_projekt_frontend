import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Definiera props som ProtectedRoute tar emot
interface ProtectedRouteProps {
    children: ReactNode; // Innehåll som visas om användaren är inloggad
}

// Hindra oinloggade användare från åtkomst till protected sidor
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Hämta states användardata och laddningsstatus från AuthContext
    const { user, loading } = useAuth();

    // Visa laddningstext om user fortfarande hämtas
    if (loading) {
        return <p>Laddar...</p>;
    }

    // Om ingen användardata skicka till /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Om inloggad, rendera skyddad sida
    return <>{children}</>;
};

export default ProtectedRoute;