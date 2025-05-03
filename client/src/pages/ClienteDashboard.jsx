import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiHeart } from 'react-icons/fi';
import Footer from "../components/Footer.jsx";
import Perfil from './PerfilCliente';
import PropiedadIndividual from './PropiedadIndividual';
import { getPropiedades } from '../services/propiedadService';
import './ClienteDashboard.css';
import AgendarCita from "./AgendarCita"; // Importa tu nuevo componente
import MisCitasCliente from "./MisCitasCliente.jsx";



const ClienteDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState("inicio");
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 4;
    const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
    const [filtros, setFiltros] = useState({
        metrosMin: "",
        metrosMax: "",
        habitaciones: "",
        parqueaderos: "",
        tipo: ""
    });

    useEffect(() => {
        const propiedadPendiente = localStorage.getItem("propiedadSeleccionada");
        if (propiedadPendiente) {
            setPropiedadSeleccionada(propiedadPendiente);
            setActiveSection("ver-propiedad");
            localStorage.removeItem("propiedadSeleccionada");
        }
        fetchPropiedades();
    }, []);

    const fetchPropiedades = async () => {
        try {
            const res = await getPropiedades();
            setPropiedades(res.data);
        } catch (err) {
            console.error("Error al obtener propiedades:", err);
        }
    };

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

    const handleLogout = () => {
        logout();
        localStorage.removeItem("propiedadSeleccionada");
    };

    const handleVerMas = (id) => {
        setPropiedadSeleccionada(id);
        setActiveSection("ver-propiedad");
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

    if (!user || user.role !== "cliente") {
        return <Navigate to="/login" />;
    }

    return (
        <div className="cliente-dashboard">
            <nav className="cliente-navbar">
                <h2 className="cliente-logo">Bienvenido, {user.name}</h2>
                <ul className="cliente-nav-links">
                    <li onClick={() => { setActiveSection("inicio"); setPropiedadSeleccionada(null); }}>
                        <FiHome /> Inicio
                    </li>
                    <li onClick={() => { setActiveSection("perfil"); setPropiedadSeleccionada(null); }}>
                        <FiUser /> Perfil
                    </li>
                    <li onClick={() => { setActiveSection("favoritos"); setPropiedadSeleccionada(null); }}>
                        <FiHeart /> Favoritos
                    </li>
                    <li onClick={() => { setActiveSection("mis-citas"); setPropiedadSeleccionada(null); }}>
                        📅 Mis Citas
                    </li>

                    <li onClick={handleLogout} className="logout">
                        <FiLogOut /> Cerrar Sesión
                    </li>
                </ul>
            </nav>

            <main className="cliente-main">
                {activeSection === "inicio" && !propiedadSeleccionada && (
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
                                        <button className="limpiar" onClick={() => setFiltros({ metrosMin: "", metrosMax: "", habitaciones: "", parqueaderos: "", tipo: "" })}>Limpiar Filtros</button>
                                        <button className="cerrar" onClick={() => setMostrarModalFiltros(false)}>Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        )}

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
                    </div>
                )}

                {activeSection === "perfil" && <Perfil />}

                {activeSection === "ver-propiedad" && propiedadSeleccionada && (
                    <PropiedadIndividual
                        propiedadId={propiedadSeleccionada}
                        setActiveSection={setActiveSection}
                    />
                )}

                {activeSection === "favoritos" && (
                    <div style={{ padding: "2rem" }}>
                        <h2>Aquí se mostrarán tus propiedades favoritas ❤️</h2>
                    </div>
                )}
                {activeSection === "agendar-cita" && propiedadSeleccionada && (
                    <AgendarCita
                        propiedadId={propiedadSeleccionada}
                        setActiveSection={setActiveSection}
                    />
                )}
                {activeSection === "mis-citas" && <MisCitasCliente
                    setActiveSection={setActiveSection}/>
                }



            </main>

            <Footer />
        </div>
    );
};

export default ClienteDashboard;