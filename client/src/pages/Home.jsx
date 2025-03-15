import { Link } from "react-router-dom";
import "./Home.css"; // Importa el CSS global
import houseImage from "../assets/edificio-Home.jpg"; // Importa la imagen

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-text">
                <h1>Bienvenido a </h1>
                <h1>AlphaEco-Construcciones</h1>
                <Link to="/login">
                    <button>Iniciar Sesión</button>
                </Link>
                <Link to="/register">
                    <button>Registrarse</button>
                </Link>
            </div>
            <div className="home-image">
                <img src={houseImage} alt="Casa" />
            </div>
        </div>
    );
};

export default Home;
