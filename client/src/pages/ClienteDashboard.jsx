import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import edificioImagen from '../assets/edificio-clienteDashboard.jpg'; // Importación de la imagen
import './ClienteDashboard.css';

const ClienteDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user || user.role !== "cliente") {
        return <Navigate to="/" />;
    }

    return (
        <div className="cliente-dashboard">
            <img src={edificioImagen} alt="Edificio" className="cliente-background" />
            <div className="cliente-content">
                <h1>Panel de Cliente</h1>
                <p>Bienvenido al sistema de ventas.</p>
                <button onClick={() => navigate("/perfil")}>Mi Perfil</button>
            </div>
        </div>
    );
};

export default ClienteDashboard;
