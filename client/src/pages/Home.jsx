import { useEffect, useState, useContext } from "react";
import { getPropiedades } from "../services/propiedadService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

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
                <Header />
                <h2 className="propiedades-title">Nuestras Propiedades</h2>
                <div className="propiedades-grid">
                    {propiedadesPaginadas.map((p) => (
                        <div key={p._id} className="prop-card">
                            {p.imagenes && p.imagenes.length > 0 && (
                                <img
                                    src={`http://localhost:5000/${p.imagenes[0]}`}
                                    alt="Imagen propiedad"
                                    className="propiedad-img-lateral"
                                />
                            )}
                            <div className="prop-details">
                                <h3>{p.titulo}</h3>
                                <span className="prop-price">${p.precio}</span>
                                <p><strong>Ubicación:</strong> {p.ubicacion}</p>
                                <p><strong>Habitaciones:</strong> {p.habitaciones}</p>
                                <p><strong>Metros cuadrados:</strong> {p.metrosCuadrados} m²</p>
                                <button onClick={() => handleVerMas(p._id)}>Saber más</button>
                            </div>
                        </div>
                    ))}
                </div>

                {propiedades.length > propiedadesPorPagina && (
                    <div className="paginacion">
                        <button onClick={paginaAnterior} disabled={paginaActual === 1}>◀ Anterior</button>
                        <span>Página {paginaActual}</span>
                        <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>Siguiente ▶</button>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default Home;
