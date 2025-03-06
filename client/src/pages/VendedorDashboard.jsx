import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user || user.role !== "vendedor") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h1>Panel de Vendedor</h1>
            <p>Bienvenido al sistema de ventas.</p>
        </div>
    );
};

export default SellerDashboard;
