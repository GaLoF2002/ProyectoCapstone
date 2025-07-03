import { useState, useContext, useEffect } from "react";
import { login } from "../services/authService";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Footer from "./Footer.jsx";
import "./Login.css";
import "./Notificacion.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, logout, login: loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [notification, setNotification] = useState(null);

    // const [aceptaPoliticas, setAceptaPoliticas] = useState(false); // 🔒 Comentado: ya no se usa

    const showNotification = (message, isError = true) => {
        setNotification({ message, isError, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // if (!aceptaPoliticas) {
        //     showNotification("Debes aceptar las políticas y condiciones para continuar.");
        //     return;
        // }

        try {
            const response = await login({ email, password });
            const propiedadPendiente = localStorage.getItem("propiedadPendiente");

            if (propiedadPendiente) {
                localStorage.removeItem("propiedadPendiente");
                navigate(`/cliente`);
                localStorage.setItem("propiedadSeleccionada", propiedadPendiente);
            } else {
                const role = response.data.user.role;
                navigate(`/${role}`);
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            loginUser(response.data.user);

            const role = response.data.user.role;
            navigate(`/${role}`);
        } catch (error) {
            showNotification(error.response?.data?.error || "Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="login-container">
                    <div className="login-background">
                        <div className="login-box">
                            <h2>Iniciar Sesión</h2>
                            <form onSubmit={handleLogin}>
                                <div className="input-container">
                                    <label htmlFor="email">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit">Ingresar</button>
                            </form>
                            <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
                                ¿Olvidaste tu contraseña?
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="btn-home"
                            >
                                Ir al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {notification?.visible && (
                <div className={`notification ${notification.isError ? 'error' : 'success'}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default Login;
