import axios from 'axios';

// ✅ Se adapta automáticamente al entorno (local o producción)
const API_URL = import.meta.env.VITE_API_URL + "/auth";

// Registrar usuario
export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

// Login
export const login = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

// Enviar email de recuperación
export const enviarEmailRecuperacion = async (email) => {
    return await axios.post(`${API_URL}/forgot-password`, { email });
};

// Resetear contraseña
export const resetearContrasena = async (token, password) => {
    return await axios.post(`${API_URL}/reset-password/${token}`, {
        password
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};
