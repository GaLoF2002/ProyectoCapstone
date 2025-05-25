import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import React, { useState, useEffect } from "react";

import { getSellers, createSeller, updateSeller, deleteSeller } from "../services/adminService";

import "./AdminDashboard.css";

import Propiedades from "../pages/Propiedades.jsx";

import CrearPropiedad from "../pages/CrearPropiedad";

import PropiedadIndividual from "../pages/PropiedadIndividual";





const AdminDashboard = () => {

    const [activeSection, setActiveSection] = useState("home");

    const [sellers, setSellers] = useState([]);

    const [search, setSearch] = useState("");

    const [sortOrder, setSortOrder] = useState("asc");

    const [newSeller, setNewSeller] = useState({ name: "", email: "", phone: "", password: "" });

    const [editSeller, setEditSeller] = useState(null);

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [modoEdicion, setModoEdicion] = useState(false);

    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);





    const handleLogout = () => {

        logout(); // Llama a la función logout del contexto

        navigate("/login"); // Redirige al login después de cerrar sesión

    };



    useEffect(() => {

        if (activeSection === "sellers") {

            fetchSellers();

        }

    }, [activeSection, search, sortOrder]);



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

            fetchSellers();

            setNewSeller({ name: "", email: "", phone: "", password: "" });

        } catch (error) {

            alert("Error al crear el vendedor");

        }

    };



    const handleEditSeller = (seller) => {

        setEditSeller(seller);

    };



    const handleUpdateSeller = async (e) => {

        e.preventDefault();

        try {

            await updateSeller(editSeller._id, editSeller);

            alert("Vendedor actualizado correctamente");

            setEditSeller(null);

            fetchSellers();

        } catch (error) {

            alert("Error al actualizar el vendedor");

        }

    };



    const handleDeleteSeller = async (id) => {

        if (window.confirm("¿Eliminar este vendedor?")) {

            try {

                await deleteSeller(id);

                alert("Vendedor eliminado correctamente");

                fetchSellers();

            } catch (error) {

                alert("Error al eliminar el vendedor");

            }

        }

    };



    return (

        <div className="dashboard-container">

            {/* Sidebar */}

            <nav className="sidebar">

                <h2>Admin Panel</h2>

                <ul>

                    <li>

                        <button onClick={() => setActiveSection("home")}>🏠 Inicio</button>

                    </li>

                    <li>

                        <button onClick={() => setActiveSection("sellers")}>📋 Vendedores</button>

                    </li>

                    <li>

                        <button onClick={() => setActiveSection("propiedades")}>🏘️ Propiedades</button>

                    </li>

                    <li>

                        <button onClick={handleLogout}>🚪 Cerrar Sesión</button>

                    </li>



                </ul>

            </nav>



            {/* Contenido Principal */}

            <div className="main-content">

                {activeSection === "home" && (

                    <div className="home-section">

                        <h1>Bienvenido al Panel de Administración</h1>

                        <p>Selecciona una opción del menú para comenzar.</p>

                    </div>

                )}



                {activeSection === "sellers" && (

                    <div className="sellers-section">

                        <div className="h1Sellers">

                            <h1>Gestión de Vendedores</h1>

                        </div>



                        <div className="sellers-container">

                            {/* Columna Izquierda: Búsqueda y Lista de Vendedores */}

                            <div className="sellers-list-container">

                                <div className="filters">

                                    <input type="text" placeholder="Buscar vendedor..." value={search} onChange={(e) => setSearch(e.target.value)} />

                                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>

                                        <option value="asc">A-Z</option>

                                        <option value="desc">Z-A</option>

                                    </select>

                                </div>



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

                            </div>



                            {/* Columna Derecha: Formulario */}

                            <div className="register-form-container">

                                <h2>{editSeller ? "Editar Vendedor" : "Crear Vendedor"}</h2>

                                <form className="register-form" onSubmit={editSeller ? handleUpdateSeller : handleCreateSeller}>

                                    <label htmlFor="name">Nombre</label>

                                    <input id="name" type="text" value={editSeller ? editSeller.name : newSeller.name} onChange={(e) => editSeller ? setEditSeller({ ...editSeller, name: e.target.value }) : setNewSeller({ ...newSeller, name: e.target.value })} required />



                                    <label htmlFor="email">Email</label>

                                    <input id="email" type="email" value={editSeller ? editSeller.email : newSeller.email} onChange={(e) => editSeller ? setEditSeller({ ...editSeller, email: e.target.value }) : setNewSeller({ ...newSeller, email: e.target.value })} required />



                                    {!editSeller && (

                                        <>

                                            <label htmlFor="password">Contraseña</label>

                                            <input id="password" type="password" value={newSeller.password} onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })} required />

                                        </>

                                    )}
                                    <label htmlFor="codigoVendedor">Código Vendedor</label>
                                    <input
                                        id="codigoVendedor"
                                        type="text"
                                        value={editSeller ? editSeller.codigoVendedor || "" : newSeller.codigoVendedor}
                                        onChange={(e) =>
                                            editSeller
                                                ? setEditSeller({ ...editSeller, codigoVendedor: e.target.value })
                                                : setNewSeller({ ...newSeller, codigoVendedor: e.target.value })
                                        }
                                    />

                                    <label htmlFor="inmobiliaria">Inmobiliaria</label>
                                    <input
                                        id="inmobiliaria"
                                        type="text"
                                        value={editSeller ? editSeller.inmobiliaria || "" : newSeller.inmobiliaria}
                                        onChange={(e) =>
                                            editSeller
                                                ? setEditSeller({ ...editSeller, inmobiliaria: e.target.value })
                                                : setNewSeller({ ...newSeller, inmobiliaria: e.target.value })
                                        }
                                    />

                                    <label htmlFor="genero">Género</label>
                                    <select
                                        id="genero"
                                        value={editSeller ? editSeller.genero || "" : newSeller.genero}
                                        onChange={(e) =>
                                            editSeller
                                                ? setEditSeller({ ...editSeller, genero: e.target.value })
                                                : setNewSeller({ ...newSeller, genero: e.target.value })
                                        }
                                    >
                                        <option value="">Seleccionar género</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                        <option value="otro">Otro</option>
                                    </select>



                                    <label htmlFor="phone">Teléfono</label>

                                    <input id="phone" type="text" value={editSeller ? editSeller.phone : newSeller.phone} onChange={(e) => editSeller ? setEditSeller({ ...editSeller, phone: e.target.value }) : setNewSeller({ ...newSeller, phone: e.target.value })} required />



                                    <button className="Submmitbutton" type="submit">{editSeller ? "Actualizar" : "Crear"}</button>

                                    {editSeller && <button onClick={() => setEditSeller(null)}>Cancelar</button>}

                                </form>

                            </div>

                        </div>

                    </div>

                )}



                {activeSection === "ver-propiedad" && propiedadSeleccionada && (

                    <PropiedadIndividual

                        propiedadId={propiedadSeleccionada}

                        setActiveSection={setActiveSection}

                    />

                )}



                {activeSection === "propiedades" && (

                    <Propiedades

                        setActiveSection={setActiveSection}

                        setPropiedadSeleccionada={setPropiedadSeleccionada}

                        setModoEdicion={setModoEdicion}

                    />

                )}



                {activeSection === "crear-propiedad" && (

                    <CrearPropiedad

                        setActiveSection={setActiveSection}

                        modoEdicion={modoEdicion}

                        propiedadEditando={propiedadSeleccionada}

                    />

                )}



            </div>

        </div>

    );

};



export default AdminDashboard;