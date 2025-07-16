import axios from 'axios';

const API_URL = 'http://localhost:5000/api/indicadores';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Obtener indicadores de visitas del mes actual
export const getIndicadores = async () => {
    return await axios.get(API_URL, {
        headers: getAuthHeaders()
    });
};

// 🔹 Obtener estadísticas específicas por propiedad
export const getIndicadoresPorPropiedad = async (propiedadId) => {
    return await axios.get(`${API_URL}/propiedadIndicador/${propiedadId}`, {
        headers: getAuthHeaders()
    });
};

