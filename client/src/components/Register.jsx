import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password, phone });
            alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (error) {
            alert("Error en registro: " + error.response?.data?.error);
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Nombre" onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Celular" onChange={(e) => setPhone(e.target.value)} required />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
