import axios from 'axios';

const API_URL = "http://localhost:5000/api/admin";

export const getSellers = async () => {
    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    return await axios.get(`${API_URL}/sellers`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const createSeller = async (sellerData) => {
    const token = localStorage.getItem("token");
    return await axios.post(`${API_URL}/create-seller`, sellerData, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};
