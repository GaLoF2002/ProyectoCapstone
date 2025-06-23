import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import edificioImg from '../assets/edificio-register.jpg';
import './Register.css';
import Footer from "./Footer.jsx";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!aceptaPoliticas) {
            alert("Debes aceptar las políticas y condiciones para continuar.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password, phone });
            alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (error) {
            alert("Error en registro: " + error.response?.data?.error);
        }
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="register-container">
                    <div className="register-image">
                        <img src={edificioImg} alt="Edificio" />
                    </div>
                    <div className="register-form-container">
                        <form className="register-form" onSubmit={handleRegister}>
                            <h2>Regístrate</h2>
                            <label>Nombre completo</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                            <label>Correo electrónico</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label>Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            <label>Teléfono Celular</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                            <div className="politicas-container">
                                <input
                                    type="checkbox"
                                    checked={aceptaPoliticas}
                                    onChange={() => setAceptaPoliticas(!aceptaPoliticas)}
                                />
                                <label>
                                    Acepto las <a href="/politicas" target="_blank">políticas y condiciones</a>
                                </label>
                            </div>


                            <button type="submit">Unirse</button>

                            <p>¿Ya estás registrado? <a href="/login">Inicia sesión</a></p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
