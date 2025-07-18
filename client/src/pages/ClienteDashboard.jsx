import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiBell } from 'react-icons/fi';
import Footer from "../components/Footer.jsx";
import Perfil from './PerfilCliente';
import PropiedadIndividual from './PropiedadIndividual';
import { getPropiedades } from '../services/propiedadService';
import './ClienteDashboard.css';
import AgendarCita from "./AgendarCita";
import MisCitasCliente from "./MisCitasCliente.jsx";
import FormularioEvaluacion from "./FormularioEvaluacion.jsx";
import SimuladorFinanciamiento from "./SimuladorFinanciamiento.jsx";
import { getNotificaciones } from '../services/notificacionesService';
import { marcarNotificacionComoLeida } from '../services/notificacionesService';

import MisIntereses from "./MisIntereses";

import { getMisCitas } from '../services/agendamientoService';


const ClienteDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState("inicio");
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [notificaciones, setNotificaciones] = useState([]);
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);


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
        fetchNotificaciones(); // Se hace una sola vez al montar
        cargarDatos();

        // Cada 2 segundos solo actualiza si hay nuevas no leídas
        const interval = setInterval(() => {
            fetchNotificaciones();
        }, 2000);

        // ✅ Limpiar el intervalo correctamente
        return () => clearInterval(interval);
    }, []);

    const cargarDatos = async () => {
        try {
            await getMisCitas(); // ✅ Esto dispara la lógica de recordatorios en el backend
            await fetchPropiedades();
            await fetchNotificaciones(); // Las trae, ya incluyendo los recordatorios generados
        } catch (err) {
            console.error("Error al cargar datos:", err);
        }
    };

    const fetchNotificaciones = async () => {
        try {
            const res = await getNotificaciones();

            const ahora = new Date();

            const notificacionesFiltradas = res.data.filter((noti) => {
                if (noti.tipo !== "recordatorio") return true;

                const match = noti.mensaje.match(/hora (\d{2}:\d{2})/);
                const matchFecha = noti.mensaje.match(/^(Hoy|Mañana)/);

                if (!match || !matchFecha) return true;

                const hora = match[1]; // ej. "15:30"
                const tipoFecha = matchFecha[1]; // "Hoy" o "Mañana"

                const fechaCita = new Date();
                if (tipoFecha === "Mañana") {
                    fechaCita.setDate(fechaCita.getDate() + 1);
                }

                // Unificar fecha y hora para comparar con "ahora"
                const [hours, minutes] = hora.split(":").map(Number);
                fechaCita.setHours(hours, minutes, 0, 0);

                return fechaCita > ahora;
            });

            setNotificaciones(notificacionesFiltradas);
        } catch (err) {
            console.error("Error al obtener notificaciones:", err);
            setNotificaciones([]);
        }
    };


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

    const [menuAbierto, setMenuAbierto] = useState(false);

    if (!user || user.role !== "cliente") {
        return <Navigate to="/login" />;
    }

    return (
        <div className="cliente-dashboard">
            <nav className="cliente-navbar">
                <h2 className="cliente-logo">Bienvenido, {user.name}</h2>

                <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
                    ☰
                </button>

                <ul className={`cliente-nav-links ${menuAbierto ? "abierto" : ""}`}>
                    <li onClick={() => { setActiveSection("inicio"); setPropiedadSeleccionada(null); setMenuAbierto(false); }}>
                        <FiHome /> Inicio
                    </li>
                    <li onClick={() => { setActiveSection("perfil"); setPropiedadSeleccionada(null); setMenuAbierto(false); }}>
                        <FiUser /> Perfil
                    </li>
                    <li onClick={() => { setActiveSection("mis-citas"); setPropiedadSeleccionada(null); setMenuAbierto(false); }}>
                        📅 Mis Citas
                    </li>
                    <li className="notificaciones-icono" onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}>
                        <FiBell />
                        <span style={{ marginRight: "0.4rem" }}>Notificaciones</span>
                        {notificaciones.length > 0 && <span className="badge">{notificaciones.length}</span>}
                    </li>
                    <li onClick={() => { setActiveSection("intereses"); setMenuAbierto(false); }}>
                        ❤️ Intereses
                    </li>
                    <li onClick={handleLogout} className="logout">
                        <FiLogOut /> Cerrar Sesión
                    </li>
                </ul>
            </nav>


            {mostrarNotificaciones && (
                <div className="modal-notificaciones-overlay">
                    <div className="modal-notificaciones">
                        <h3>📢 Notificaciones</h3>
                        <button className="cerrar-modal" onClick={() => setMostrarNotificaciones(false)}>✖</button>
                        {notificaciones.length === 0 ? (
                            <p>No hay nuevos mensajes</p>
                        ) : (
                            <ul>
                                {notificaciones.map((notif) => (
                                    <li key={notif._id} style={{ marginBottom: "1rem" }}>
                                        <span>{notif.mensaje}</span>
                                        <button
                                            onClick={async () => {
                                                await marcarNotificacionComoLeida(notif._id);
                                                // Elimina del estado local directamente (suficiente)
                                                setNotificaciones(prev => prev.filter(n => n._id !== notif._id));
                                            }}
                                            style={{ marginLeft: "1rem", padding: "2px 6px" }}
                                        >
                                            Marcar como leída
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}



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
                {activeSection === "evaluar-compra" && propiedadSeleccionada && (
                    <FormularioEvaluacion
                        propiedadId={propiedadSeleccionada}
                        onFinalizar={() => {
                            setPropiedadSeleccionada(null);
                            setActiveSection("inicio");
                        }}
                    />
                )}
                {activeSection === "simulador" && propiedadSeleccionada && (
                    <SimuladorFinanciamiento
                        propiedadId={propiedadSeleccionada}
                        setActiveSection={setActiveSection}
                    />
                )}
                {activeSection === "intereses" && (
                    <MisIntereses
                        setActiveSection={setActiveSection}
                        setPropiedadSeleccionada={setPropiedadSeleccionada}
                    />
                )}




            </main>

            <Footer />
        </div>
    );
};

export default ClienteDashboard;