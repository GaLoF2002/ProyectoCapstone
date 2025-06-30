import axios from 'axios';

// Compatible con local y Heroku
const API_URL = import.meta.env.VITE_API_URL + '/notificaciones';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Obtener todas las notificaciones del usuario
export const getNotificaciones = async () => {
    return await axios.get(`${API_URL}`, {
        headers: getAuthHeaders()
    });
};

// Marcar una notificación como leída
export const marcarNotificacionComoLeida = async (id) => {
    return await axios.patch(`${API_URL}/leer/${id}`, {}, {
        headers: getAuthHeaders()
    });
};

// Marcar todas las notificaciones como leídas
export const marcarTodasComoLeidas = async () => {
    return await axios.patch(`${API_URL}/leer-todas`, {}, {
        headers: getAuthHeaders()
    });
};

// Eliminar una notificación
export const eliminarNotificacion = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });
};
