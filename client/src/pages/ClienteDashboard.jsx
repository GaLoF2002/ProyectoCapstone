import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {FiUser, FiLogOut, FiHome} from 'react-icons/fi';
import './ClienteDashboard.css';
import Footer from "../components/Footer.jsx";
import Perfil from './PerfilCliente';

const ClienteDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    if (!user || user.role !== "cliente") {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Cliente</h2>
                <ul>
                    <li onClick={() => setMostrarPerfil(true)}> <FiUser /> Mi Perfil</li>
                    <li onClick={() => { setMostrarPerfil(false); navigate("/propiedades"); }}> <FiHome /> Propiedades</li>
                    <li onClick={handleLogout} className="logout"> <FiLogOut /> Cerrar Sesión</li>
                </ul>
            </aside>

            <div className="main-container">
                {mostrarPerfil ? (
                    <div className="perfil-section active">
                        <Perfil />
                    </div>
                ) : (
                    <main className="dashboard-content">
                        <div className="content-box">
                            <h1>Bienvenido, {user.name}!</h1>
                            <p>Explora propiedades y administra tu cuenta fácilmente.</p>
                        </div>
                    </main>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ClienteDashboard;
