import { useState, useContext, useEffect } from "react";
import { login } from "../services/authService";
import { Navigate, useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation
import { AuthContext } from "../context/AuthContext";
import Footer from "./Footer.jsx"; // Agregamos el footer
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, logout, login: loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Se usa correctamente location



    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            loginUser(response.data.user);

            const role = response.data.user.role;
            navigate(`/${role}`);
        } catch (error) {
            alert("Error en login: " + error.response?.data?.error);
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
