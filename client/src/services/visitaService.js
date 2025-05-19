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
