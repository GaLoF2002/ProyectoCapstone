// services/interesService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/interes";
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

export const marcarInteres = async (propiedadId) => {
    return await axios.post(`${API_URL}/marcar-interes`, { propiedadId }, {
        headers: getAuthHeaders()
    });
};

export const getMisIntereses = async () => {
    return await axios.get(`${API_URL}/mis-intereses`, {
        headers: getAuthHeaders()
    });
};


// services/interesService.js
export const verificarInteres = async (propiedadId) => {
    return await axios.get(`${API_URL}/mis-intereses`, {
        headers: getAuthHeaders()
    });
};

export const desmarcarInteres = async (propiedadId) => {
    return await axios.delete(`${API_URL}/interes/${propiedadId}`, { headers: getAuthHeaders() });
};
