import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/">Startsida</NavLink></li>
                    <li><NavLink to="/login">Logga in</NavLink></li>
                    <li><NavLink to="/register">Registera</NavLink></li>

                    {user && (
                        <>
                            <li>
                                <NavLink to="/profile">Min profil ({user.username})</NavLink>
                                <button onClick={handleLogout}>Logga ut</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header;

