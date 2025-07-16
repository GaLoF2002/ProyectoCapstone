import React, { useEffect, useState, useContext } from "react";
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

    const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
    const [filtros, setFiltros] = useState({
        metrosMin: "",
        metrosMax: "",
        habitaciones: "",
        parqueaderos: "",
        tipo: ""
    });

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const aplicarFiltros = async () => {
        try {
            const res = await getPropiedades(filtros);
            setPropiedades(res.data);
            setPaginaActual(1);
        } catch (err) {
            console.error("Error al aplicar filtros", err);
        }
    };

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
            <Header />
            <div className="home-container">
                <div className="title-and-filter">
                    <h2 className="propiedades-title">Nuestras Propiedades</h2>
                    <button className="filtros-toggle" onClick={() => setMostrarModalFiltros(true)}>
                        🔍 Filtros
                    </button>
                </div>

                {mostrarModalFiltros && (
                    <div className="modal-filtros-overlay">
                        <div className="modal-filtros">
                            <h3>Filtrar Propiedades</h3>
                            <div className="filtros-grid">
                                <input type="number" name="metrosMin" placeholder="Min m²" value={filtros.metrosMin} onChange={handleFiltroChange} />
                                <input type="number" name="metrosMax" placeholder="Max m²" value={filtros.metrosMax} onChange={handleFiltroChange} />
                                <input type="number" name="habitaciones" placeholder="Habitaciones" value={filtros.habitaciones} onChange={handleFiltroChange} />
                                <input type="number" name="parqueaderos" placeholder="Parqueaderos" value={filtros.parqueaderos} onChange={handleFiltroChange} />
                                <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                                    <option value="">Todos los tipos</option>
                                    <option value="casa">Casa</option>
                                    <option value="departamento">Departamento</option>
                                    <option value="terreno">Terreno</option>
                                </select>
                            </div>
                            <div className="modal-filtros-botones">
                                <button onClick={() => { aplicarFiltros(); setMostrarModalFiltros(false); }}>Aplicar</button>
                                <button className="limpiar" onClick={() => setFiltros({ metrosMin: "", metrosMax: "", habitaciones: "", parqueaderos: "", tipo: "" })}>
                                    Limpiar Filtros
                                </button>
                                <button className="cerrar" onClick={() => setMostrarModalFiltros(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="propiedades-grid">
                    {propiedadesPaginadas.map((p) => (
                        <div key={p._id} className="prop-card">
                            {p.imagenes && p.imagenes.length > 0 ? (
                                <img
                                    src={`http://localhost:5000/${p.imagenes[0]}`}
                                    alt="Imagen propiedad"
                                    className="propiedad-img-lateral"
                                />
                            ) : (
                                <div className="placeholder-img">No Image</div>
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
                    <div className="Home-paginacion">
                        <button onClick={paginaAnterior} disabled={paginaActual === 1}>◀ Anterior</button>
                        <span>Página {paginaActual}</span>
                        <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>Siguiente ▶</button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;