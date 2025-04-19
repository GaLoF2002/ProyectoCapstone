import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import './ClienteDashboard.css';
import Footer from "../components/Footer.jsx";
import Perfil from './PerfilCliente';
import Propiedades from '../pages/Propiedades';
import PropiedadIndividual from './PropiedadIndividual';

const ClienteDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("home");
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

    useEffect(() => {
        // Por si llega desde login después de querer ver una propiedad
        const propiedadPendiente = localStorage.getItem("propiedadSeleccionada");
        if (propiedadPendiente) {
            setPropiedadSeleccionada(propiedadPendiente);
            setActiveSection("ver-propiedad");
            localStorage.removeItem("propiedadSeleccionada");
        }
    }, []);

    if (!user || user.role !== "cliente") {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Cliente</h2>
                <ul>
                    <li onClick={() => {
                        setActiveSection("perfil");
                        setPropiedadSeleccionada(null);
                    }}>
                        <FiUser /> Mi Perfil
                    </li>

                    <li onClick={() => {
                        setActiveSection("propiedades");
                        setPropiedadSeleccionada(null);
                    }}>
                        <FiHome /> Propiedades
                    </li>

                    <li onClick={handleLogout} className="logout">
                        <FiLogOut /> Cerrar Sesión
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className="main-container">
                {activeSection === "home" && (
                    <main className="dashboard-content">
                        <div className="content-box">
                            <h1>Bienvenido, {user.name}!</h1>
                            <p>Explora propiedades y administra tu cuenta fácilmente.</p>
                        </div>
                    </main>
                )}

                {activeSection === "perfil" && (
                    <Perfil />
                )}

                {activeSection === "propiedades" && (
                    <Propiedades
                        setActiveSection={setActiveSection}
                        setPropiedadSeleccionada={setPropiedadSeleccionada}
                    />
                )}

                {activeSection === "ver-propiedad" && propiedadSeleccionada && (
                    <PropiedadIndividual
                        propiedadId={propiedadSeleccionada}
                        setActiveSection={setActiveSection}
                    />
                )}
            </div>
        </div>
    );
};

export default ClienteDashboard;
