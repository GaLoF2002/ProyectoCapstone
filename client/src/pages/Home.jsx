import { Link } from "react-router-dom";
import "./Home.css";
import houseImage from "../assets/edificio-Home.jpg";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="page-container">
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
            <Footer />
        </div>
    );
};

export default Home;
