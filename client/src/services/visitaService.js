import axios from 'axios';

const API_URL = 'http://localhost:5000/api/visitas';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const registrarVisita = async (propiedadId) => {
    return await axios.post(`${API_URL}/registrar/${propiedadId}`, {}, {
        headers: getAuthHeaders()
    });
};
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

