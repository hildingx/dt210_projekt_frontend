import { Outlet } from "react-router-dom"; // För att rendera undersidor
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.css";

//Definierar sidans övergripande struktur
const Layout = () => {
    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Outlet /> {/* Rendera aktuell sida beroende på vilken route som används */}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
