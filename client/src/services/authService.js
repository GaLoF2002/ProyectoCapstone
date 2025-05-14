import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

export const enviarEmailRecuperacion = (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetearContrasena = async (token, password) => {
    return await axios.post(`${API_URL}/reset-password/${token}`, {
        password, // ✅ Se envía solo la nueva contraseña en el body
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};