import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSellers, createSeller, updateSeller, deleteSeller } from '../services/adminService';


const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editSeller, setEditSeller] = useState(null);
    const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', phone: '' });

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        fetchSellers();
    }, []);

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

    const handleEditSeller = (seller) => {
        setEditSeller(seller);
        setShowForm(true);
    };

    const handleUpdateSeller = async (e) => {
        e.preventDefault();
        try {
            await updateSeller(editSeller._id, editSeller);
            alert("Vendedor actualizado correctamente");
            setShowForm(false);
            fetchSellers(); // Recargar lista de vendedores
            setEditSeller(null);
        } catch (error) {
            alert("Error al actualizar el vendedor");
        }
    };

    const handleDeleteSeller = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este vendedor?")) {
            try {
                await deleteSeller(id);
                alert("Vendedor eliminado correctamente");
                fetchSellers(); // Recargar lista de vendedores
            } catch (error) {
                alert("Error al eliminar el vendedor");
            }
        }
    };

    return (
        <div>
            <h1>Panel de Administrador</h1>
            <button onClick={() => {
                setShowForm(!showForm);
                setEditSeller(null);
            }}>
                {showForm ? "Cerrar Formulario" : "Crear Vendedor"}
            </button>

            {showForm && (
                <form onSubmit={editSeller ? handleUpdateSeller : handleCreateSeller}>
                    <input type="text" placeholder="Nombre" value={editSeller ? editSeller.name : newSeller.name}
                           onChange={(e) => {
                               editSeller
                                   ? setEditSeller({...editSeller, name: e.target.value})
                                   : setNewSeller({...newSeller, name: e.target.value});
                           }} required/>
                    <input type="email" placeholder="Email" value={editSeller ? editSeller.email : newSeller.email}
                           onChange={(e) => {
                               editSeller
                                   ? setEditSeller({...editSeller, email: e.target.value})
                                   : setNewSeller({...newSeller, email: e.target.value});
                           }} required/>
                    {!editSeller && (
                        <input type="password" placeholder="Contraseña" value={newSeller.password}
                               onChange={(e) => setNewSeller({...newSeller, password: e.target.value})} required/>
                    )}
                    <input type="text" placeholder="Celular" value={editSeller ? editSeller.phone : newSeller.phone}
                           onChange={(e) => {
                               editSeller
                                   ? setEditSeller({...editSeller, phone: e.target.value})
                                   : setNewSeller({...newSeller, phone: e.target.value});
                           }} required/>
                    {/* Campo opcional para cambiar la contraseña */}
                    <input type="password" placeholder="Nueva Contraseña (Opcional)"
                           onChange={(e) => {
                               editSeller
                                   ? setEditSeller({...editSeller, password: e.target.value})
                                   : setNewSeller({...newSeller, password: e.target.value});
                           }}/>
                    <button type="submit">{editSeller ? "Actualizar Vendedor" : "Guardar"}</button>
                </form>
            )}

            <h2>Lista de Vendedores</h2>
            <ul>
                {sellers.map((seller) => (
                    <li key={seller._id}>
                        {seller.name} - {seller.email} - {seller.phone}
                        <button onClick={() => handleEditSeller(seller)}>✏️ Editar</button>
                        <button onClick={() => handleDeleteSeller(seller._id)}>🗑️ Eliminar</button>
                    </li>
                ))}
            </ul>


        </div>

    );
};

export default AdminDashboard;
