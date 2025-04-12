import { useEffect, useState, useContext } from "react";
import { getPropiedades } from "../services/propiedadService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";
import Footer from "../components/Footer";
import houseImage from "../assets/edificio-Home.jpg";

const Home = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 4;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPropiedades = async () => {
            try {
                const res = await getPropiedades();
                setPropiedades(res.data);
            } catch (err) {
                console.error("Error al obtener propiedades:", err);
            }
        };
        fetchPropiedades();
    }, []);

    const handleVerMas = (id) => {
        if (!user) {
            localStorage.setItem("propiedadPendiente", id);
            navigate("/login");
        } else {
            localStorage.setItem("propiedadSeleccionada", id);
            navigate("/cliente");
        }
    };

    const indiceInicio = (paginaActual - 1) * propiedadesPorPagina;
    const indiceFin = indiceInicio + propiedadesPorPagina;
    const propiedadesPaginadas = propiedades.slice(indiceInicio, indiceFin);

    const paginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const paginaSiguiente = () => {
        if (indiceFin < propiedades.length) setPaginaActual(paginaActual + 1);
    };

    return (
        <div className="page-container">
            <div className="home-container">

                {/* Parte superior - Bienvenida y botones */}
                <div className="home-text">
                    <h1>Bienvenido a</h1>
                    <h1>AlphaEco-Construcciones</h1>
                    <Link to="/login"><button>Iniciar Sesión</button></Link>
                    <Link to="/register"><button>Registrarse</button></Link>
                </div>

                <div className="home-image">
                    <img src={houseImage} alt="Casa" />
                </div>

                {/* Listado de Propiedades */}
                <h2 className="propiedades-title">Nuestras Propiedades</h2>

                <div className="propiedades-home">
                    {propiedadesPaginadas.map((p) => (
                        <div key={p._id} className="prop-card-home">
                            <h3>{p.titulo}</h3>
                            <p>Ubicación: {p.ubicacion}</p>
                            <p>Precio: ${p.precio}</p>
                            <p>Habitaciones: {p.habitaciones}</p>
                            <p>Metros cuadrados: {p.metrosCuadrados}</p>
                            <button onClick={() => handleVerMas(p._id)}>Saber más</button>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                {propiedades.length > propiedadesPorPagina && (
                    <div className="paginacion">
                        <button onClick={paginaAnterior} disabled={paginaActual === 1}>
                            ◀ Anterior
                        </button>
                        <span>Página {paginaActual}</span>
                        <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>
                            Siguiente ▶
                        </button>
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
};

export default Home;
