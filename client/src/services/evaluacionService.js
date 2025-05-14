import axios from 'axios';

const API_URL = 'http://localhost:5000/api/evaluacion'; // sin "evaluaciones"


const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// 🔹 Crear evaluación de compra con PDF
export const crearEvaluacion = async (formData) => {
    return await axios.post(`${API_URL}/evaluacion-compra`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 🔹 Obtener evaluaciones por ID de propiedad (contado/credito ordenados)
export const getEvaluacionesPorPropiedad = async (propiedadId) => {
    return await axios.get(`${API_URL}/evaluacion-compra/por-propiedad/${propiedadId}`, {
        headers: getAuthHeaders()
    });
};
