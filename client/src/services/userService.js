import axios from 'axios';

const API_URL = "http://localhost:5000/api/user";

// Obtener el perfil del usuario
export const obtenerPerfilCliente = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", localStorage.getItem("token"));

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
