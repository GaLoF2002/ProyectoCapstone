import axios from 'axios';

const API_URL = "http://localhost:5000/api/admin";

export const getSellers = async (search = "", sort = "asc") => {
    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    return await axios.get(`${API_URL}/sellers`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        params: {
            search,
            sort
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

export const updateSeller = async (id, sellerData) => {
    const token = localStorage.getItem("token");
    return await axios.put(`${API_URL}/update-sellers/${id}`, sellerData, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

export const deleteSeller = async (id) => {
    const token = localStorage.getItem("token");
    return await axios.delete(`${API_URL}/delete-sellers/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
};
