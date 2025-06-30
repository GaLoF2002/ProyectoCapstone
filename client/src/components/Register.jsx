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
    const [mostrarModal, setMostrarModal] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL + "/auth";



    const handleRegister = async (e) => {
        e.preventDefault();

        if (!aceptaPoliticas) {
            alert("Debes aceptar las políticas y condiciones para continuar.");
            return;
        }
        try {
            await axios.post(`${API_URL}/register`, { name, email, password, phone });
            alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (error) {
            alert("Error en registro: " + error.response?.data?.error || error.message);
        }
    };
    console.log(API_URL);


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
                                    Acepto las <a href="/politicas" onClick={(e) => {
                                    e.preventDefault();
                                    setMostrarModal(true);
                                }} className="link-text">políticas y condiciones</a>
                                </label>
                            </div>




                            <button type="submit">Unirse</button>

                            <p>¿Ya estás registrado? <a href="/login">Inicia sesión</a></p>
                        </form>
                    </div>
                </div>
            </div>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Política de Tratamiento de Datos Personales</h3>
                        <p>
                            Al continuar con este proceso, usted declara que ha leído y acepta los términos y condiciones establecidos.
                            Autorizo expresamente la recopilación, almacenamiento, tratamiento y uso de mis datos personales con fines
                            estrictamente relacionados con la evaluación de mi perfil como cliente, el análisis de capacidad de compra,
                            el ofrecimiento de productos o servicios inmobiliarios, el contacto comercial y la mejora de la experiencia del usuario.
                        </p>
                        <p>
                            Mis datos serán tratados conforme a lo establecido en la <strong>Ley Orgánica de Protección de Datos Personales del Ecuador</strong>,
                            garantizando su confidencialidad, integridad y un uso legítimo y responsable. En ningún caso mis datos serán vendidos ni
                            compartidos con terceros sin mi consentimiento previo, salvo en los casos establecidos por la ley.
                        </p>
                        <button onClick={() => setMostrarModal(false)} className="cerrar-modal">Cerrar</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>

    );
};

export default Register;
