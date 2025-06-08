import axios from 'axios';

const API_URL = 'http://localhost:5000/api/estadisticas-citas';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// 🔹 Obtener todas las citas del mes actual (vendedor o admin)
export const obtenerCitasDelMes = async () => {
    return await axios.get(`${API_URL}/citas-mes`, {
        headers: getAuthHeaders()
    });
};

// 🔹 Marcar una cita como ejecutada
export const marcarCitaComoEjecutada = async (id) => {
    return await axios.put(`${API_URL}/cita/${id}/ejecutar`, {}, {
        headers: getAuthHeaders()
    });
};

// 🔹 Obtener resumen mensual de citas ejecutadas por vendedor (solo el vendedor lo ve)
export const obtenerResumenMensualPorVendedor = async () => {
    return await axios.get(`${API_URL}/vendedor/resumen`, {
        headers: getAuthHeaders()
    });
};

// 🔹 Obtener resumen mensual de todos los vendedores (solo el admin lo ve)
export const obtenerResumenMensualParaAdmin = async () => {
    return await axios.get(`${API_URL}/admin/resumen-citas`, {
        headers: getAuthHeaders()
    });
};
