export interface Review {
    _id: string;
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
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}