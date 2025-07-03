import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Propiedades from "../pages/Propiedades";
import CrearPropiedad from "../pages/CrearPropiedad";
import PropiedadIndividual from "./PropiedadIndividual.jsx";
import AgendamientoVendedor from "./AgendamientoVendedor.jsx";
import "./VendedorDashboard.css"; // Make sure this path is correct
import GestionarCitasVendedor from "./GestionarCitasVendedor.jsx";
import CitasPendientesVendedor from "./CitasPendientesVendedor.jsx";
import AdminCompradoresPage from "./AdminCompradoresPage.jsx";
import IndicadoresPage from "../pages/IndicadoresPage";
import EstadisticasCitasVendedor from "./EstadisticasCitasVendedor.jsx";
import EvaluacionDetalleCliente from "./EvaluacionDetalleCliente.jsx";

// Componente para la sección de Inicio del Dashboard del Vendedor
const HomeSection = ({ onNavigate }) => {
    return (
        <div className="home-section">
            <h1 className="home-title">Bienvenido al Panel del Vendedor</h1>
            <p className="home-subtitle">Selecciona una opción del menú para comenzar.</p>

            <div className="dashboard-shortcuts">
                {/* Acceso a Propiedades */}
                <div className="shortcut-item" onClick={() => onNavigate('propiedades')}>
                    <span className="icon-properties">🏠</span> {/* Ícono de casa/edificio para Propiedades */}
                    <p>Mis Propiedades</p>
                </div>

                {/* Acceso a Agendamiento */}
                <div className="shortcut-item" onClick={() => onNavigate('agendamiento')}>
                    <span className="icon-appointments">📅</span> {/* Ícono de calendario para Agendamiento */}
                    <p>Agendamiento</p>
                </div>

                {/* Acceso a Citas Pendientes */}
                <div className="shortcut-item" onClick={() => onNavigate('citas-pendientes')}>
                    <span className="icon-pending-appointments">📋</span> {/* Ícono de lista para Citas Pendientes */}
                    <p>Citas Pendientes</p>
                </div>

                {/* Acceso a Ver Compradores */}
                <div className="shortcut-item" onClick={() => onNavigate('ver-compradores')}>
                    <span className="icon-buyers">👥</span> {/* Ícono de usuarios para Compradores */}
                    <p>Ver Compradores</p>
                </div>

                {/* Acceso a Reportes */}
                <div className="shortcut-item" onClick={() => onNavigate('reportes')}>
                    <span className="icon-reports">📈</span> {/* Ícono de gráfico para Reportes */}
                    <p>Ver Reportes</p>
                </div>

                {/* Acceso a Citas Ejecutadas */}
                <div className="shortcut-item" onClick={() => onNavigate('citas-resumen')}>
                    <span className="icon-stats">📊</span> {/* Ícono de estadísticas para Citas Ejecutadas */}
                    <p>Citas Ejecutadas</p>
                </div>

                {/* Puedes añadir más accesos directos aquí si tienes más secciones relevantes para el vendedor */}
            </div>
        </div>
    );
};


const VendedorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [evaluacionSeleccionadaId, setEvaluacionSeleccionadaId] = useState(null);

    const [activeSection, setActiveSection] = useState("home");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

    if (!user || user.role !== "vendedor") {
        return <Navigate to="/" />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="vendedor-dashboard-container">
            {/* Sidebar */}
            <nav className="vendedor-sidebar">
                <h2>Vendedor Panel</h2>
                <ul>
                    <li>
                        <button onClick={() => setActiveSection("home")}>🏠 Inicio</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("perfil")}>👤 Perfil</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("propiedades")}>🏘️ Propiedades</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("agendamiento")}>📅 Agendamiento</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("citas-pendientes")}>📋 Citas Pendientes</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("ver-compradores")}>🧾 Ver Compradores</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("reportes")}>📈 Ver Reportes</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection("citas-resumen")}>📊 Citas Ejecutadas</button>
                    </li>
                    <li>
                        <button onClick={handleLogout}>🚪 Cerrar Sesión</button>
                    </li>
                </ul>
            </nav>

            {/* Contenido Principal */}
            <div className="vendedor-main-content">
                {activeSection === "home" && (
                    <HomeSection onNavigate={setActiveSection} />
                )}

                {activeSection === "propiedades" && (
                    <div className="vendedor-propiedades-section">
                        <Propiedades
                            setActiveSection={setActiveSection}
                            setPropiedadSeleccionada={setPropiedadSeleccionada}
                            setModoEdicion={setModoEdicion}
                        />
                    </div>
                )}
                {activeSection === "crear-propiedad" && (
                    <div className="vendedor-crear-propiedad-section">
                        <CrearPropiedad
                            setActiveSection={setActiveSection}
                            modoEdicion={modoEdicion}
                            propiedadEditando={propiedadSeleccionada}
                        />
                    </div>
                )}
                {activeSection === "ver-propiedad" && propiedadSeleccionada && (
                    <div className="vendedor-ver-propiedad-section">
                        <PropiedadIndividual
                            propiedadId={propiedadSeleccionada}
                            setActiveSection={setActiveSection}
                        />
                    </div>
                )}

                {activeSection === "perfil" && (
                    <div className="vendedor-dashboard-content">
                        <h1>Perfil del Vendedor</h1>
                    </div>
                )}

                {activeSection === "agendamiento" && (
                    <div className="vendedor-agendamiento-section">
                        <AgendamientoVendedor />
                    </div>
                )}
                {activeSection === "mis-citas" && (
                    <div className="vendedor-citas-section">
                        <GestionarCitasVendedor />
                    </div>
                )}
                {activeSection === "citas-pendientes" && (
                    <div className="vendedor-citas-pendientes-section">
                        <CitasPendientesVendedor />
                    </div>
                )}
                {activeSection === "ver-compradores" && (
                    <div className="vendedor-compradores-section">
                        <AdminCompradoresPage
                            setActiveSection={setActiveSection}
                            setPropiedadSeleccionada={setPropiedadSeleccionada}
                            setEvaluacionSeleccionadaId={setEvaluacionSeleccionadaId} />
                    </div>
                )}
                {activeSection === "reportes" && (
                    <div className="vendedor-reportes-section">
                        <IndicadoresPage />
                    </div>
                )}
                {activeSection === "citas-resumen" && (
                    <div className="vendedor-citas-resumen-section">
                        <EstadisticasCitasVendedor />
                    </div>
                )}
                {activeSection === "detalle-evaluacion" && evaluacionSeleccionadaId && (
                    <EvaluacionDetalleCliente evaluacionId={evaluacionSeleccionadaId} />
                )}
            </div>
        </div>
    );
};

export default VendedorDashboard;