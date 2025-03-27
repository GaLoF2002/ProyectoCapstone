import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./VendedorDashboard.css";
import Footer from "../components/Footer.jsx";

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
                    <li onClick={() => setActiveSection("citas")} className={activeSection === "citas" ? "active" : ""}>📅 Citas</li>
                    <li onClick={() => setActiveSection("notificaciones")} className={activeSection === "notificaciones" ? "active" : ""}>🔔 Notificaciones</li>
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
                {activeSection !== "home" && <div className="dashboard-content">{activeSection}</div>}
            </main>
            <Footer />
        </div>
    );
};

export default VendedorDashboard;
