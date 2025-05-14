// services/agendamientoService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/agendamiento';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

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


// ========== CITAS ========== //

// Crear una cita (cliente)
export const crearCita = async (citaData) => {
    return await axios.post(`${API_URL}/citas`, citaData, {
        headers: getAuthHeaders()
    });
};

// Obtener todas las citas del usuario logueado (cliente o vendedor)
export const getMisCitas = async () => {
    const headers = getAuthHeaders();
    console.log("🔑 Headers enviados en getMisCitas:", headers);
    return await axios.get(`${API_URL}/citas`, { headers });
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
