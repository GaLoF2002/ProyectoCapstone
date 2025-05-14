import React, { useState } from "react";
import { enviarEmailRecuperacion } from "../services/authService";
import "./ForgotPassword.css";
import imagenEdificio from '../assets/edificio-forgotPass.jpg';
import Footer from "../components/Footer.jsx";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await enviarEmailRecuperacion(email);
            setMessage(res.data.msg);
        } catch (error) {
            setMessage("Error al procesar la solicitud.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Recuperar contraseña</h2>
                <p className="reset-password-instructions">
                    Ingresa tu correo electrónico registrado y te enviaremos un enlace para que puedas restablecer tu
                    contraseña.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Enviar enlace</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
            <div className="forgot-password-background" style={{backgroundImage: `url(${imagenEdificio})`}}></div>
            <Footer/>
        </div>
    );
};

export default ForgotPassword;