import axios from 'axios';

// ✅ Apunta a /api/admin en local y producción
const API_URL = import.meta.env.VITE_API_URL + "/admin";

// 🔐 Headers con token
const getAuthHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

// 📄 Obtener lista de vendedores (con búsqueda y orden)
export const getSellers = async (search = "", sort = "asc") => {
    return await axios.get(`${API_URL}/sellers`, {
        headers: getAuthHeaders(),
        params: { search, sort }
    });
};

// ➕ Crear nuevo vendedor
export const createSeller = async (sellerData) => {
    return await axios.post(`${API_URL}/create-seller`, sellerData, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        }
    });
};

// ✏️ Actualizar vendedor por ID
export const updateSeller = async (id, sellerData) => {
    return await axios.put(`${API_URL}/update-sellers/${id}`, sellerData, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        }
    });
};

// ❌ Eliminar vendedor
export const deleteSeller = async (id) => {
    return await axios.delete(`${API_URL}/delete-sellers/${id}`, {
        headers: getAuthHeaders()
    });
};
