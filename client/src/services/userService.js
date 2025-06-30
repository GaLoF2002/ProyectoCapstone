import axios from 'axios';

// ✅ Usa la variable de entorno para adaptarse a Heroku o localhost
const API_URL = import.meta.env.VITE_API_URL + "/user";

// Obtener el perfil del usuario
export const obtenerPerfilCliente = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(`${API_URL}/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

// Actualizar el perfil del usuario
export const actualizarPerfil = async (data) => {
    const token = localStorage.getItem("token");
    return await axios.post(`${API_URL}/profile`, data, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};
