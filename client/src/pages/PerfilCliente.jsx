import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { obtenerPerfilCliente, actualizarPerfil } from "../services/userService";

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // ✅ Inicialización del hook

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const res = await obtenerPerfilCliente();
                setPerfil({ ...res.data, password: '' }); // No mostrar la contraseña
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setMessage("Error al cargar el perfil.");
            }
        };

        fetchPerfil();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setPerfil({
            ...perfil,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarPerfil(perfil);
            setMessage("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setMessage("Error al actualizar el perfil");
        }
    };

    return (
        <div>
            <h2>Mi Perfil</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={perfil.name}
                    placeholder="Nombre"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={perfil.email}
                    placeholder="Correo"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={perfil.phone}
                    placeholder="Teléfono"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={perfil.password}
                    placeholder="Nueva Contraseña (opcional)"
                    onChange={handleChange}
                />
                <button type="submit">Guardar Cambios</button>
            </form>

            <button onClick={() => navigate("/cliente")} style={{ marginTop: "10px" }}>
                Regresar al Dashboard
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Perfil;
