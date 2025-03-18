import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfilCliente, actualizarPerfil } from "../services/userService";
import edificioImagen from "../assets/edificio-PerfilCliente.jpg"; // Importación de la imagen
import "./PerfilCliente.css";

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const res = await obtenerPerfilCliente();
                setPerfil({ ...res.data, password: "" });
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setMessage("Error al cargar el perfil.");
            }
        };
        fetchPerfil();
    }, []);

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
        <div className="perfil-container">
            <img src={edificioImagen} alt="Edificio" className="perfil-background" />
            <div className="perfil-box">
                <h2>Mi Perfil</h2>

                <form className="perfil-form" onSubmit={handleSubmit}>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={perfil.name}
                        onChange={handleChange}
                        required
                    />
                    <label>Correo</label>
                    <input
                        type="email"
                        name="email"
                        value={perfil.email}
                        onChange={handleChange}
                        required
                    />
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="phone"
                        value={perfil.phone}
                        onChange={handleChange}
                        required
                    />
                    <label>Nueva Contraseña (opcional)</label>
                    <input
                        type="password"
                        name="password"
                        value={perfil.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Guardar Cambios</button>
                </form>

                <button className="perfil-back-button" onClick={() => navigate("/cliente")}>
                    Regresar al Dashboard
                </button>

                {message && <p className={message.includes("Error") ? "perfil-error" : "perfil-message"}>{message}</p>}
            </div>
        </div>
    );
};

export default Perfil;
