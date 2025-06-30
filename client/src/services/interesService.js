import axios from "axios";

// Usa VITE_API_URL para que funcione en cualquier entorno
const API_URL = import.meta.env.VITE_API_URL + "/interes";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Marcar una propiedad como de interés
export const marcarInteres = async (propiedadId) => {
    return await axios.post(`${API_URL}/marcar-interes`, { propiedadId }, {
        headers: getAuthHeaders()
    });
};

// Obtener intereses del usuario logueado
export const getMisIntereses = async () => {
    return await axios.get(`${API_URL}/mis-intereses`, {
        headers: getAuthHeaders()
    });
};

// Verificar si una propiedad ya está marcada como interés
export const verificarInteres = async (propiedadId) => {
    return await axios.get(`${API_URL}/mis-intereses`, {
        headers: getAuthHeaders()
    });
};

// Desmarcar una propiedad de interés
export const desmarcarInteres = async (propiedadId) => {
    return await axios.delete(`${API_URL}/interes/${propiedadId}`, {
        headers: getAuthHeaders()
    });
};
