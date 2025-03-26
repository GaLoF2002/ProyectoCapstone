import { useState } from "react";
import { enviarEmailRecuperacion } from "../services/authService";

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
        <div>
            <h2>Recuperar contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo registrado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar enlace</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
