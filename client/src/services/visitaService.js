import axios from 'axios';

// ✅ Usa la variable de entorno para que se adapte según el entorno
const API_URL = import.meta.env.VITE_API_URL + '/visitas';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Registrar una visita cuando se abre una propiedad
export const registrarVisita = async (propiedadId) => {
    return await axios.post(`${API_URL}/registrar/${propiedadId}`, {}, {
        headers: getAuthHeaders()
    });
};

// Registrar la duración de visualización de una propiedad
export const registrarDuracionVisualizacion = async (propiedadId, duracionSegundos) => {
    return await axios.post(`${API_URL}/registrar-duracion`, {
        propiedadId,
        duracionSegundos
    }, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
};
