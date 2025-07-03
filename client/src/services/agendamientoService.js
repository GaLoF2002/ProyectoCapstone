import axios from 'axios';

// ✅ Compatible con local y producción
const API_URL = import.meta.env.VITE_API_URL + "/agendamiento";

// 🔐 Función común para headers con token
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

// ==================== DISPONIBILIDAD ====================

// Crear nueva disponibilidad (solo vendedor)
export const crearDisponibilidad = async (disponibilidadData) => {
    return await axios.post(`${API_URL}/disponibilidad`, disponibilidadData, {
        headers: getAuthHeaders()
    });
};

// Obtener disponibilidad por ID de vendedor
export const getDisponibilidadPorVendedor = async (vendedorId) => {
    return await axios.get(`${API_URL}/disponibilidad/${vendedorId}`, {
        headers: getAuthHeaders()
    });
};

// ======================= CITAS =======================

// Crear una cita (cliente)
export const crearCita = async (citaData) => {
    return await axios.post(`${API_URL}/citas`, citaData, {
        headers: getAuthHeaders()
    });
};

// Obtener todas las citas del usuario logueado (cliente o vendedor)
export const getMisCitas = async () => {
    return await axios.get(`${API_URL}/citas`, {
        headers: getAuthHeaders()
    });
};

// Cambiar estado de una cita (aceptar / cancelar)
export const cambiarEstadoCita = async (citaId, nuevoEstado) => {
    return await axios.put(`${API_URL}/citas/${citaId}/estado`, { estado: nuevoEstado }, {
        headers: getAuthHeaders()
    });
};

// Reagendar una cita (solo cliente)
export const reagendarCita = async (citaId, nuevaFecha, nuevaHora) => {
    return await axios.put(`${API_URL}/citas/${citaId}/reagendar`, {
        nuevaFecha,
        nuevaHora
    }, {
        headers: getAuthHeaders()
    });
};

// Eliminar una cita (opcional)
export const eliminarCita = async (citaId) => {
    return await axios.delete(`${API_URL}/citas/${citaId}`, {
        headers: getAuthHeaders()
    });
};
