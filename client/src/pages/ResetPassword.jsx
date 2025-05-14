import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetearContrasena } from "../services/authService";
import Footer from "../components/Footer.jsx";
import imagenEdificio from '../assets/edificio-resetPass.jpg';
import "./ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await resetearContrasena(token, password);
            setMessage(res.data.msg || "Contraseña actualizada correctamente");

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setMessage("Error al restablecer la contraseña");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h2>Restablecer Contraseña</h2>
                <h3 className="new-password-instructions">
                    Ingresa tu nueva contraseña.
                </h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Guardar</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
            <div className="forgot-password-background" style={{backgroundImage: `url(${imagenEdificio})`}}></div>
            <Footer />
        </div>
    );
};

export default ResetPassword;