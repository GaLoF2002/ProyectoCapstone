import axios from 'axios';

// Usar variable de entorno para API base
const API_URL = import.meta.env.VITE_API_URL + '/evaluacion';

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

// 🔹 Obtener evaluaciones por ID de propiedad
export const getEvaluacionesPorPropiedad = async (propiedadId) => {
    return await axios.get(`${API_URL}/evaluacion-compra/por-propiedad/${propiedadId}`, {
        headers: getAuthHeaders()
    });
};

// 🔹 Simular financiamiento
export const simularFinanciamiento = async ({ propiedadId, porcentajeEntrada, plazoAnios }) => {
    return await axios.post(`${API_URL}/simular-financiamiento`, {
        propiedadId,
        porcentajeEntrada,
        plazoAnios
    }, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
};

// 🔹 Obtener evaluación por ID
export const getEvaluacionPorId = async (evaluacionId) => {
    return await axios.get(`${API_URL}/evaluacion-detalle/${evaluacionId}`, {
        headers: getAuthHeaders()
    });
};
