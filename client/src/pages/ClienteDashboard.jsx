import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ClienteDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // ✅ Definir el hook de navegación

    if (!user || user.role !== "cliente") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h1>Panel de Cliente</h1>
            <p>Bienvenido al sistema de ventas.</p>

            <button onClick={() => navigate("/perfil")}>Mi Perfil</button>
        </div>
    );
};

export default ClienteDashboard;
