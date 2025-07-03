import axios from 'axios';

// ✅ Se adapta automáticamente a /api/propiedades en producción
const API_URL = import.meta.env.VITE_API_URL + '/propiedades';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Obtener todas las propiedades con filtros
export const getPropiedades = async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return await axios.get(`${API_URL}?${params}`, {
        headers: getAuthHeaders()
    });
};

// Obtener una sola propiedad por ID
export const getPropiedadPorId = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

// Crear una nueva propiedad con imágenes
export const crearPropiedad = async (formData) => {
    return await axios.post(API_URL, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // muy importante
        }
    });
};

// Actualizar una propiedad (sin imágenes nuevas)
export const actualizarPropiedad = async (id, data) => {
    return await axios.put(`${API_URL}/${id}`, data, {
        headers: getAuthHeaders()
    });
};

// Eliminar una propiedad
export const eliminarPropiedad = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });
};
