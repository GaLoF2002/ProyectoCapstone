import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Propiedades from "../pages/Propiedades";
import CrearPropiedad from "../pages/CrearPropiedad";
import PropiedadIndividual from "./PropiedadIndividual.jsx";
import AgendamientoVendedor from "./AgendamientoVendedor.jsx";
import "./VendedorDashboard.css";
import GestionarCitasVendedor from "./GestionarCitasVendedor.jsx";

const VendedorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
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
                        <button onClick={() => setActiveSection("mis-citas")}>🗓️ Mis Citas</button>
                    </li>



                    <li>
                        <button onClick={handleLogout}>🚪 Cerrar Sesión</button>
                    </li>
                </ul>
            </nav>

            {/* Contenido Principal */}
            <div className="vendedor-main-content">
                {activeSection === "home" && (
                    <div className="vendedor-home-section">
                        <h1>Bienvenido al Panel del Vendedor</h1>
                        <p>Selecciona una opción del menú para comenzar.</p>
                    </div>
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
                        <h2>Tu perfil aparecería aquí</h2>
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



            </div>
        </div>
    );
};

export default VendedorDashboard;
