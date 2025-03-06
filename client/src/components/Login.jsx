import { useState, useContext } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login: loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            // Guardar el nuevo token en localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            loginUser(response.data.user);

            const role = response.data.user.role;
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "vendedor") {
                navigate("/vendedor");
            } else {
                navigate("/");
            }
        } catch (error) {
            alert("Error en login: " + error.response?.data?.error);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
