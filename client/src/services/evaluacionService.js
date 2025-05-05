import axios from 'axios';

const API_URL = 'http://localhost:5000/api/evaluacion';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Enviar una evaluación con archivos PDF
export const crearEvaluacion = async (formData) => {
    return await axios.post(`${API_URL}/`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
};
