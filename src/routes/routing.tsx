import { createBrowserRouter } from "react-router-dom"; // React router för nav
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage"; // Startsida
import BookPage from "../pages/BookPage"; // Enskild boksida, bokid
import LoginPage from "../pages/LoginPage"; // Inloggningssida
import RegisterPage from "../pages/RegisterPage"; // Registreringssida
import ProfilePage from "../pages/ProfilePage"; // Profilsida
import ProtectedRoute from "../components/ProtectedRoute"; // Skydd för vissa sidor
import NotFoundPage from "../pages/NotFoundPage"; // 404 sida

// Definiera alla routes
const router = createBrowserRouter([
    {
        // Layout omger alla sidor, innehåller header, footer och <outlet>
        path: "/",
        element: <Layout />,
        children: [ // childrutter som laddas in i outlet
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "book/:id", // Dynamisk route för specifik bok
                element: <BookPage />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegisterPage />
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute> {/* Skyddad rutt */}
                        <ProfilePage />
                    </ProtectedRoute>
                )
            },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

export default router;

