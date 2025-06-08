import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSellers, createSeller, updateSeller, deleteSeller } from "../services/adminService";
import Propiedades from "../pages/Propiedades.jsx";
import CrearPropiedad from "../pages/CrearPropiedad";
import PropiedadIndividual from "../pages/PropiedadIndividual";
import ResumenMensualAdmin from "../pages/ResumenMensualAdmin.jsx";

import "./AdminDashboard.css"; // Asegúrate que esta ruta sea correcta

// Componente para la sección de Inicio del Dashboard
const HomeSection = ({ onNavigate }) => {
    return (
        <div className="home-section">
            <h1 className="home-title">Bienvenido al Panel de Administración</h1>
            <p className="home-subtitle">Selecciona una opción del menú para comenzar.</p>

            <div className="dashboard-shortcuts">
                {/* Acceso a Vendedores */}
                <div className="shortcut-item" onClick={() => onNavigate('sellers')}>
                    <span className="icon-sellers">👤</span> {/* Ícono de usuario/persona para Vendedores */}
                    <p>Vendedores</p>
                </div>

                {/* Acceso a Propiedades */}
                <div className="shortcut-item" onClick={() => onNavigate('propiedades')}>
                    <span className="icon-properties">🏠</span> {/* Ícono de casa/edificio para Propiedades */}
                    <p>Propiedades</p>
                </div>

                {/* Puedes añadir más accesos directos aquí si tienes más secciones */}
                {/*
                <div className="shortcut-item" onClick={() => onNavigate('Reportes')}>
                    <span className="icon-reports">📊</span>
                    <p>Reportes</p>
                </div>
                */}
            </div>
        </div>
    );
};

// Componente principal del Dashboard
const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("home"); // Estado para la sección activa
    const [sellers, setSellers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [newSeller, setNewSeller] = useState({
        name: "", email: "", phone: "", password: "",
        codigoVendedor: "", inmobiliaria: "", genero: ""
    });
    const [editSeller, setEditSeller] = useState(null); // Contendrá el objeto vendedor completo para editar
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [modoEdicion, setModoEdicion] = useState(false);
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        if (activeSection === "sellers") {
            fetchSellers();
        }
    }, [activeSection, search, sortOrder]);

    const fetchSellers = async () => {
        try {
            const response = await getSellers(search, sortOrder);
            setSellers(response.data || []);
        } catch (error) {
            console.error("Error al obtener vendedores:", error);
            alert("Error al obtener la lista de vendedores.");
        }
    };

    const handleInputChange = (e, isEditMode) => {
        const { id, value } = e.target;
        const fieldName = e.target.name || id; // Usar 'name' si existe, si no 'id'

        if (isEditMode) {
            setEditSeller(prev => ({ ...prev, [fieldName]: value }));
        } else {
            setNewSeller(prev => ({ ...prev, [fieldName]: value }));
        }
    };

    const resetNewSellerForm = () => {
        setNewSeller({ name: "", email: "", phone: "", password: "", codigoVendedor: "", inmobiliaria: "", genero: "" });
    };

    const handleCreateSeller = async (e) => {
        e.preventDefault();
        try {
            await createSeller(newSeller);
            alert("Vendedor creado correctamente");
            fetchSellers();
            resetNewSellerForm();
        } catch (error) {
            console.error("Error al crear vendedor:", error);
            alert("Error al crear el vendedor: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEditSellerClick = (seller) => {
        setEditSeller({ ...seller }); // Cargar datos del vendedor en el estado de edición
    };

    const handleUpdateSeller = async (e) => {
        e.preventDefault();
        if (!editSeller || !editSeller._id) return;
        try {
            // Excluir la contraseña del objeto a actualizar si no se va a cambiar
            // eslint-disable-next-line no-unused-vars
            const { password, ...dataToUpdate } = editSeller; // La contraseña no se envía si no se está editando específicamente ese campo
            await updateSeller(editSeller._id, dataToUpdate);
            alert("Vendedor actualizado correctamente");
            setEditSeller(null); // Salir del modo edición
            fetchSellers();
        } catch (error) {
            console.error("Error al actualizar vendedor:", error);
            alert("Error al actualizar el vendedor: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSeller = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar este vendedor?")) {
            try {
                await deleteSeller(id);
                alert("Vendedor eliminado correctamente");
                fetchSellers();
            } catch (error) {
                console.error("Error al eliminar vendedor:", error);
                alert("Error al eliminar el vendedor: " + (error.response?.data?.message || error.message));
            }
        }
    };

    // Determina qué datos mostrar en el formulario (creación o edición)
    const formData = editSeller || newSeller;

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li><button onClick={() => setActiveSection("home")}>🏠 Inicio</button></li>
                    <li><button onClick={() => setActiveSection("sellers")}>📋 Vendedores</button></li>
                    <li><button onClick={() => setActiveSection("propiedades")}>🏘️ Propiedades</button></li>
                    <li><button onClick={() => setActiveSection("resumen-citas")}>📊 Resumen Citas</button></li>

                    <li><button onClick={handleLogout}>🚪 Cerrar Sesión</button></li>
                </ul>
            </nav>

            <div className="main-content">
                {activeSection === "home" && (
                    // Renderiza el nuevo componente HomeSection con accesos por iconos
                    <HomeSection onNavigate={setActiveSection} />
                )}

                {activeSection === "sellers" && (
                    <div className="sellers-section">
                        <div className="h1Sellers">
                            <h1>Gestión de Vendedores</h1>
                        </div>

                        <div className="sellers-container">
                            <div className="sellers-list-container">
                                <div className="sellers-list">
                                    <h2>Lista de Vendedores</h2>
                                    <div className="filters">
                                        <input type="text" placeholder="Buscar vendedor..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                            <option value="asc">A-Z</option>
                                            <option value="desc">Z-A</option>
                                        </select>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="sellers-table">
                                            <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Código</th>
                                                <th>Inmobiliaria</th>
                                                <th>Género</th>
                                                <th>Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {sellers.length > 0 ? sellers.map((seller) => (
                                                <tr key={seller._id}>
                                                    <td data-label="Nombre">{seller.name}</td>
                                                    <td data-label="Email">{seller.email}</td>
                                                    <td data-label="Teléfono">{seller.phone}</td>
                                                    <td data-label="Código">{seller.codigoVendedor || "-"}</td>
                                                    <td data-label="Inmobiliaria">{seller.inmobiliaria || "-"}</td>
                                                    <td data-label="Género">{seller.genero || "-"}</td>
                                                    <td data-label="Acciones" className="actions-cell">
                                                        <button className="action-button edit-button" onClick={() => handleEditSellerClick(seller)}>✏️</button>
                                                        <button className="action-button delete-button" onClick={() => handleDeleteSeller(seller._id)}>🗑️</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                        No se encontraron vendedores o la lista está vacía.
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="register-form-container">
                                <h2>{editSeller ? "Editar Vendedor" : "Crear Nuevo Vendedor"}</h2>
                                <form className="register-form" onSubmit={editSeller ? handleUpdateSeller : handleCreateSeller}>
                                    <label htmlFor="name">Nombre Completo</label>
                                    <input id="name" type="text" value={formData.name || ""} onChange={(e) => handleInputChange(e, !!editSeller)} required />

                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" value={formData.email || ""} onChange={(e) => handleInputChange(e, !!editSeller)} required />

                                    {!editSeller && ( // Mostrar campo de contraseña solo si no estamos editando
                                        <>
                                            <label htmlFor="password">Contraseña</label>
                                            <input id="password" type="password" value={newSeller.password || ""} onChange={(e) => handleInputChange(e, false)} required />
                                        </>
                                    )}

                                    <label htmlFor="phone">Teléfono</label>
                                    <input id="phone" type="tel" value={formData.phone || ""} onChange={(e) => handleInputChange(e, !!editSeller)} required />

                                    <label htmlFor="codigoVendedor">Código Vendedor</label>
                                    <input id="codigoVendedor" type="text" value={formData.codigoVendedor || ""} onChange={(e) => handleInputChange(e, !!editSeller)} />

                                    <label htmlFor="inmobiliaria">Inmobiliaria</label>
                                    <input id="inmobiliaria" type="text" value={formData.inmobiliaria || ""} onChange={(e) => handleInputChange(e, !!editSeller)} />

                                    <label htmlFor="genero">Género</label>
                                    <select id="genero" value={formData.genero || ""} onChange={(e) => handleInputChange(e, !!editSeller)}>
                                        <option value="">Seleccionar género...</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                        <option value="otro">Otro</option>
                                        <option value="prefiero no decir">Prefiero no decir</option>
                                    </select>

                                    <button className="Submmitbutton" type="submit">{editSeller ? "Actualizar Vendedor" : "Crear Vendedor"}</button>
                                    {editSeller && <button type="button" className="Cancelbutton" onClick={() => setEditSeller(null)}>Cancelar Edición</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "ver-propiedad" && propiedadSeleccionada && (
                    <PropiedadIndividual propiedadId={propiedadSeleccionada} setActiveSection={setActiveSection} />
                )}
                {activeSection === "propiedades" && (
                    <Propiedades setActiveSection={setActiveSection} setPropiedadSeleccionada={setPropiedadSeleccionada} setModoEdicion={setModoEdicion} />
                )}
                {activeSection === "crear-propiedad" && (
                    <CrearPropiedad setActiveSection={setActiveSection} modoEdicion={modoEdicion} propiedadEditando={propiedadSeleccionada} />
                )}
                {activeSection === "resumen-citas" && (
                    <ResumenMensualAdmin />
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;