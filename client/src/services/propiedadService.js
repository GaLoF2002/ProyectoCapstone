import axios from 'axios';

const API_URL = 'http://localhost:5000/api/propiedades';

export const getPropiedades = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const crearPropiedad = async (data) => {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
