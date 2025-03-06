import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSellers, createSeller } from '../services/adminService';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(true);

    // Cargar vendedores solo si el usuario es admin
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
            fetchSellers(); // Recargar la lista de vendedores
            setNewSeller({ name: '', email: '', password: '', phone: '' });
        } catch (error) {
            alert("Error al crear el vendedor");
        }
    };

    // Mostrar una pantalla de carga mientras se verifica el usuario
    if (loading) {
        return <p>Cargando...</p>;
    }

    // Si no es admin, redirigir
    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h1>Panel de Administrador</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cerrar Formulario" : "Crear Vendedor"}
            </button>

            {showForm && (
                <form onSubmit={handleCreateSeller}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newSeller.name}
                        onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newSeller.email}
                        onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={newSeller.password}
                        onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Celular"
                        value={newSeller.phone}
                        onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                        required
                    />
                    <button type="submit">Guardar</button>
                </form>
            )}

            <h2>Lista de Vendedores</h2>
            <ul>
                {sellers.map((seller) => (
                    <li key={seller._id}>{seller.name} - {seller.email} - {seller.phone}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
