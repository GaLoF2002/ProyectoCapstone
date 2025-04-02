import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Propiedades from "../pages/Propiedades";
import CrearPropiedad from "../pages/CrearPropiedad";
import Footer from "../components/Footer.jsx";
import "./VendedorDashboard.css";

const VendedorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("home");

    if (!user || user.role !== "vendedor") {
        return <Navigate to="/" />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Vendedor</h2>
                <ul>
                    <li onClick={() => setActiveSection("home")} className={activeSection === "home" ? "active" : ""}>🏠 Home</li>
                    <li onClick={() => setActiveSection("perfil")} className={activeSection === "perfil" ? "active" : ""}>👤 Perfil</li>
                    <li onClick={() => setActiveSection("propiedades")} className={activeSection === "propiedades" ? "active" : ""}>🏢 Administrar Propiedades</li>
                    <li onClick={() => setActiveSection("crear-propiedad")} className={activeSection === "crear-propiedad" ? "active" : ""}>➕ Nueva Propiedad</li>
                    <li onClick={handleLogout} className="logout">🚪 Cerrar Sesión</li>
                </ul>
            </aside>

            <main className="main-container">
                {activeSection === "home" && (
                    <div className="dashboard-content">
                        <div className="content-box">
                            <h1>Bienvenido al Dashboard del Vendedor</h1>
                            <p>Aquí puedes gestionar tus propiedades, citas y notificaciones.</p>
                        </div>
                    </div>
                )}

                {activeSection === "propiedades" && (
                    <Propiedades setActiveSection={setActiveSection} />
                )}

                {activeSection === "crear-propiedad" && (
                    <CrearPropiedad setActiveSection={setActiveSection} />
                )}

                {activeSection === "perfil" && (
                    <div className="dashboard-content">
                        <h2>Tu perfil aparecería aquí</h2>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default VendedorDashboard;
