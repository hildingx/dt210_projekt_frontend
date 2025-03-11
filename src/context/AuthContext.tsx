import { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials, AuthContextType, AuthResponse } from "../types/types";
import axios from "axios";

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`${API_URL}/auth/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setUser(res.data.user))
                .catch(() => logout());
        } else {
            logout();
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const res = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext) as AuthContextType;
};
