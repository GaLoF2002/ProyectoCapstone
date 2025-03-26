import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetearContrasena } from "../services/authService";

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

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setMessage("Error al restablecer la contraseña");
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Guardar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
