// Struktur för en recension i databasen
export interface Review {
    _id: string; // Unikt id för recension (från databas)
    bookId: string; // ID för den bok recensionen gäller
    userId: { _id: string; username: string }; // Användare som skrivit recension
    reviewText: string; // Recensionstext
    rating: number; // Betyg
    createdAt: string; // Skapades
}

// Definiera en användare
export interface User {
    _id: string; // Unikt ID för användare
    username: string;
}

// Definierar struktur för autentiseringskontext
export interface AuthContextType {
    user: User | null; // Inloggad användare eller null om utloggad
    login: (credentials: LoginCredentials) => Promise<void>; // Loginfunktion
    logout: () => void; // Logoutfunktion
    loading: boolean; // Om användardata fortfarande laddas
}

// Typ för de uppgifter som skickas vid inloggning
export interface LoginCredentials {
    username: string;
    password: string;
}

// Definierar API-svaret vid en lyckad inloggning
export interface AuthResponse {
    user: User;
    token: string;
}