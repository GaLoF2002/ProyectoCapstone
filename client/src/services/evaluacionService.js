import axios from 'axios';

const API_URL = 'http://localhost:5000/api/evaluacion';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};


export const crearEvaluacion = async (formData) => {
    return await axios.post(`${API_URL}/compra`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
};


