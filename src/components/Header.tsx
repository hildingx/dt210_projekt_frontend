import { NavLink } from "react-router-dom"

const Header = () => {

    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/">Startsida</NavLink></li>
                    <li><NavLink to="/login">Logga in</NavLink></li>
                    <li><NavLink to="/register">Registera</NavLink></li>
                    <li><NavLink to="/profile">Min profil</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header