import axios from 'axios';

const API_URL = 'http://localhost:5000/api/propiedades';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`
    };
};

// Obtener todas las propiedades
export const getPropiedades = async () => {
    return await axios.get(API_URL, {
        headers: getAuthHeaders()
    });
};

// Obtener una sola propiedad por ID
export const getPropiedadPorId = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

// Crear una nueva propiedad con imágenes
export const crearPropiedad = async (formData) => {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // muy importante
        }
    });
};


// Actualizar una propiedad (sin imágenes nuevas, por simplicidad)
export const actualizarPropiedad = async (id, data) => {
    return await axios.put(`${API_URL}/${id}`, data, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
};

export const eliminarPropiedad = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });
};
