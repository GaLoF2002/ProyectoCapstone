import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-text">
                    <h1>AlphaEco-Construcciones</h1>
                </div>
                <div className="header-buttons">
                    <Link to="/login"><button>Iniciar Sesión</button></Link>
                    <Link to="/register"><button>Registrarse</button></Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
