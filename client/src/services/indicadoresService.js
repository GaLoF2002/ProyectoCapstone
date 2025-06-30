import axios from 'axios';

// Usar la variable de entorno que se adapta a local y producción
const API_URL = import.meta.env.VITE_API_URL + '/indicadores';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// 🔹 Obtener indicadores de visitas del mes actual
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
