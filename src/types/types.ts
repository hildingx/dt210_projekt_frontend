export interface Review {
    _id: string;
    bookId: string;
    userId: { _id: string; username: string };
    reviewText: string;
    rating: number;
    createdAt: string;
}

export interface User {
    _id: string;
    username: string;
}

export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}