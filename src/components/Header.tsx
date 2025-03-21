// Headerkomponent, visar navigering och banner

import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import bannerImage from "../assets/banner_library.jpg";

const Header = () => {
    // Hämta användardata från AuthContext
    const { user, logout } = useAuth();
    // Funktion för att byta sida
    const navigate = useNavigate();

    // Funktion för att logga ut användare och skicka till loginsida
    const handleLogout = () => {
        logout(); // Anropa logout från AuthContext
        navigate("/login");
    };

    return (
        <header>
            <div className={styles.header}>
                <NavLink to="/" className={styles.logo}>📚</NavLink>

                {/* Navmeny */}
                <ul className={styles.navList}>
                    <li><NavLink to="/" className={styles.navLink}>Startsida</NavLink></li>

                    {/* Visa logga in om användare inte är inloggad */}
                    {!user && (
                        <>
                            <li><NavLink to="/login" className={styles.navLink}>Logga in</NavLink></li>
                        </>
                    )}

                    {/* Visa min profil och logga ut om användare är inloggad */}
                    {user && (
                        <>
                            <li><NavLink to="/profile" className={styles.navLink}>Min profil ({user.username})</NavLink></li>
                            <li><button className={styles.logoutButton} onClick={handleLogout}>Logga ut</button></li>
                        </>
                    )}
                </ul>
            </div>
            <div className={styles.banner}>
                <img src={bannerImage} alt="Böcker och recensioner" />
            </div>
        </header>
    )
}

export default Header;

