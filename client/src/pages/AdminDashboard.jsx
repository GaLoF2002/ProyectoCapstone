import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSellers, createSeller, updateSeller, deleteSeller } from '../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editSeller, setEditSeller] = useState(null);
    const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', phone: '' });
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchSellers();
    }, [search, sortOrder]);

    const fetchSellers = async () => {
        try {
            const response = await getSellers(search, sortOrder);
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
            setShowCreateForm(false);
            fetchSellers();
            setNewSeller({ name: '', email: '', password: '', phone: '' });
        } catch (error) {
            alert("Error al crear el vendedor");
        }
    };

    const handleEditSeller = (seller) => {
        setEditSeller(seller);
        setShowCreateForm(false);
    };

    const handleCloseForms = () => {
        setEditSeller(null);
        setShowCreateForm(false);
    };

    const handleUpdateSeller = async (e) => {
        e.preventDefault();
        try {
            await updateSeller(editSeller._id, editSeller);
            alert("Vendedor actualizado correctamente");
            handleCloseForms();
            fetchSellers();
        } catch (error) {
            alert("Error al actualizar el vendedor");
        }
    };

    const handleDeleteSeller = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este vendedor?")) {
            try {
                await deleteSeller(id);
                alert("Vendedor eliminado correctamente");
                fetchSellers();
            } catch (error) {
                alert("Error al eliminar el vendedor");
            }
        }
    };

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administrador</h1>

            <div className="button-group">
                <button className="toggle-form-button" onClick={() => {
                    if (showCreateForm || editSeller) {
                        handleCloseForms();
                    } else {
                        setShowCreateForm(true);
                    }
                }}>
                    {showCreateForm || editSeller ? "Cerrar Formulario" : "Crear Vendedor"}
                </button>
            </div>

            <div className="admin-content">
                {/* Filtros de búsqueda y orden */}
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Buscar vendedor por nombre"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </select>
                </div>

                {/* Lista de vendedores */}
                <div className="sellers-list">
                    <h2>Lista de Vendedores</h2>
                    <ul>
                        {sellers.map((seller) => (
                            <li key={seller._id}>
                                {seller.name} - {seller.email} - {seller.phone}
                                <button className="edit-button" onClick={() => handleEditSeller(seller)}>✏️ Editar</button>
                                <button className="delete-button" onClick={() => handleDeleteSeller(seller._id)}>🗑️ Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Formulario de creación */}
                {showCreateForm && (
                    <div className="register-form-container">
                        <h2>Crear Vendedor</h2>
                        <form className="register-form" onSubmit={handleCreateSeller}>
                            <label>Nombre</label>
                            <input type="text" value={newSeller.name} onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })} required />

                            <label>Email</label>
                            <input type="email" value={newSeller.email} onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })} required />

                            <label>Contraseña</label>
                            <input type="password" value={newSeller.password} onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })} required />

                            <label>Celular</label>
                            <input type="text" value={newSeller.phone} onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })} required />

                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                )}

                {/* Formulario de edición */}
                {editSeller && (
                    <div className="register-form-container">
                        <h2>Editar Vendedor</h2>
                        <form className="register-form" onSubmit={handleUpdateSeller}>
                            <input type="text" placeholder="Nombre" value={editSeller.name} onChange={(e) => setEditSeller({ ...editSeller, name: e.target.value })} required />
                            <input type="email" placeholder="Email" value={editSeller.email} onChange={(e) => setEditSeller({ ...editSeller, email: e.target.value })} required />
                            <input type="text" placeholder="Celular" value={editSeller.phone} onChange={(e) => setEditSeller({ ...editSeller, phone: e.target.value })} required />
                            <input type="password" placeholder="Nueva Contraseña (Opcional)" onChange={(e) => setEditSeller({ ...editSeller, password: e.target.value })} />
                            <button type="submit">Actualizar Vendedor</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
