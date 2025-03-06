import axios from 'axios';

const API_URL = "http://localhost:5000/api/admin";

export const getSellers = async () => {
    return await axios.get(`${API_URL}/sellers`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } // 📌 Asegurar que el token se envía correctamente
    });
};

export const createSeller = async (sellerData) => {
    return await axios.post(`${API_URL}/create-seller`, sellerData, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // 📌 Se envía correctamente el token
        }
    });
};
