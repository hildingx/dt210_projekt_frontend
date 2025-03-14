import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import bannerImage from "../assets/banner_library.jpg";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header>
            <div className={styles.header}>
                <NavLink to="/" className={styles.logo}>📚</NavLink>

                <ul className={styles.navList}>
                    <li><NavLink to="/" className={styles.navLink}>Startsida</NavLink></li>
                    {!user && (
                        <>
                            <li><NavLink to="/login" className={styles.navLink}>Logga in</NavLink></li>
                        </>
                    )}
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

