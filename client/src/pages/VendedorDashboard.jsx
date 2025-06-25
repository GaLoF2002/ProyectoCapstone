import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Propiedades from "../pages/Propiedades";
import CrearPropiedad from "../pages/CrearPropiedad";
import PropiedadIndividual from "./PropiedadIndividual.jsx";
import AgendamientoVendedor from "./AgendamientoVendedor.jsx";
import "./VendedorDashboard.css"; // This CSS file will be updated
import GestionarCitasVendedor from "./GestionarCitasVendedor.jsx";
import CitasPendientesVendedor from "./CitasPendientesVendedor.jsx";
import AdminCompradoresPage from "./AdminCompradoresPage.jsx";
import IndicadoresPage from "../pages/IndicadoresPage";
import EstadisticasCitasVendedor from "./EstadisticasCitasVendedor.jsx";
import EvaluacionDetalleCliente from "./EvaluacionDetalleCliente.jsx";

const HomeSection = ({ onNavigate }) => {
    return (
        <div className="home-section">
            <h1 className="home-title">Bienvenido al Panel del Vendedor</h1>
            <p className="home-subtitle">Selecciona una opción del menú para comenzar.</p>

            <div className="dashboard-shortcuts">
                <div className="shortcut-item" onClick={() => onNavigate('propiedades')}>
                    <span className="icon-properties">🏠</span>
                    <p>Mis Propiedades</p>
                </div>

                <div className="shortcut-item" onClick={() => onNavigate('agendamiento')}>
                    <span className="icon-appointments">📅</span>
                    <p>Agendamiento</p>
                </div>

                <div className="shortcut-item" onClick={() => onNavigate('citas-pendientes')}>
                    <span className="icon-pending-appointments">📋</span>
                    <p>Citas Pendientes</p>
                </div>

                <div className="shortcut-item" onClick={() => onNavigate('ver-compradores')}>
                    <span className="icon-buyers">👥</span>
                    <p>Ver Compradores</p>
                </div>

                <div className="shortcut-item" onClick={() => onNavigate('reportes')}>
                    <span className="icon-reports">📈</span>
                    <p>Ver Reportes</p>
                </div>

                <div className="shortcut-item" onClick={() => onNavigate('citas-resumen')}>
                    <span className="icon-stats">📊</span>
                    <p>Citas Ejecutadas</p>
                </div>
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
    // Keep menuAbierto, but it will now control the entire sidebar sliding
    const [menuAbierto, setMenuAbierto] = useState(false);

    if (!user || user.role !== "vendedor") {
        return <Navigate to="/" />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // This function will also close the sidebar on mobile when a menu item is clicked
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setMenuAbierto(false); // Close the sidebar
    };

    return (
        <div className="vendedor-dashboard-container">
            {/* Hamburger button: Now outside the sidebar, shown only on mobile */}
            <button className="vendedor-hamburger-menu" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Abrir menú">
                ☰
            </button>

            {/* Sidebar: Apply 'abierto' class directly to the nav for slide-in/out effect */}
            <nav className={`vendedor-sidebar ${menuAbierto ? "abierto" : ""}`}>
                {/* Remove the internal sidebar-header div and hamburger button from here */}
                <h2 className="vendedor-logo">Vendedor Panel</h2>

                {/* No conditional class on ul anymore, as the whole nav slides */}
                <ul className="vendedor-nav-links">
                    <li>
                        {/* Use handleSectionChange to also close the menu */}
                        <button onClick={() => handleSectionChange("home")}>🏠 Inicio</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("perfil")}>👤 Perfil</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("propiedades")}>🏘️ Propiedades</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("agendamiento")}>📅 Agendamiento</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("citas-pendientes")}>📋 Citas Pendientes</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("ver-compradores")}>🧾 Ver Compradores</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("reportes")}>📈 Ver Reportes</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange("citas-resumen")}>📊 Citas Ejecutadas</button>
                    </li>
                    <li>
                        {/* Ensure logout also closes the menu */}
                        <button onClick={() => { handleLogout(); setMenuAbierto(false); }}>🚪 Cerrar Sesión</button>
                    </li>
                </ul>
            </nav>

            {/* Contenido Principal */}
            <div className="vendedor-main-content">
                {activeSection === "home" && <HomeSection onNavigate={handleSectionChange} />}

                {activeSection === "propiedades" && (
                    <div className="vendedor-propiedades-section">
                        <Propiedades
                            setActiveSection={handleSectionChange}
                            setPropiedadSeleccionada={setPropiedadSeleccionada}
                            setModoEdicion={setModoEdicion}
                        />
                    </div>
                )}
                {activeSection === "crear-propiedad" && (
                    <div className="vendedor-crear-propiedad-section">
                        <CrearPropiedad
                            setActiveSection={handleSectionChange}
                            modoEdicion={modoEdicion}
                            propiedadEditando={propiedadSeleccionada}
                        />
                    </div>
                )}
                {activeSection === "ver-propiedad" && propiedadSeleccionada && (
                    <div className="vendedor-ver-propiedad-section">
                        <PropiedadIndividual propiedadId={propiedadSeleccionada} setActiveSection={handleSectionChange} />
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
                            setActiveSection={handleSectionChange}
                            setPropiedadSeleccionada={setPropiedadSeleccionada}
                            setEvaluacionSeleccionadaId={setEvaluacionSeleccionadaId}
                        />
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