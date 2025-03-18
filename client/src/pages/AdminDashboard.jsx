import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSellers, createSeller } from '../services/adminService';
import './AdminDashboard.css'; // Importación del CSS

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === "admin") {
            fetchSellers();
        }
        setLoading(false);
    }, [user]);

    const fetchSellers = async () => {
        try {
            const response = await getSellers();
            setSellers(response.data);
        } catch (error) {
            alert("Error al obtener la lista de vendedores");
        }
    };

    const handleCreateSeller = async (e) => {
        e.preventDefault();
        try {
            await createSeller(newSeller);
            alert("Vendedor creado correctamente");
            setShowForm(false);
            fetchSellers();
            setNewSeller({ name: '', email: '', password: '', phone: '' });
        } catch (error) {
            alert("Error al crear el vendedor");
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return (
        <div className="admin-dashboard">
            <h1>Panel del Administrador</h1>
            <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cerrar Formulario" : "Crear Vendedor"}
            </button>

            {showForm && (
                <div className="admin-content">
                    <div className="register-form-container">
                        <form className="register-form" onSubmit={handleCreateSeller}>
                            <label className="a">Nombre</label>
                            <input
                                type="text"
                                value={newSeller.name}
                                onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                                required
                            />
                            <label className="a">Email</label>
                            <input
                                type="email"
                                value={newSeller.email}
                                onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                                required
                            />
                            <label className="a">Contraseña</label>
                            <input
                                type="password"
                                value={newSeller.password}
                                onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
                                required
                            />
                            <label className="a">Celular</label>
                            <input
                                type="text"
                                value={newSeller.phone}
                                onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                                required
                            />
                            <button type="submit">Guardar</button>
                        </form>
                    </div>

                    <div className="sellers-list">
                        <h2>Lista de Vendedores</h2>
                        <ul>
                            {sellers.map((seller) => (
                                <li key={seller._id}>{seller.name} - {seller.email} - {seller.phone}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
