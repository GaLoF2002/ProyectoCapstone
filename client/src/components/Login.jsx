import {useState, useContext, useEffect} from "react";
import { login } from "../services/authService";
import {Navigate, useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css"; // Importar estilos

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {user,logout, login: loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Solo se ejecuta si el usuario viene al login DESDE el dashboard (o estando logueado)
        if (user && location.pathname === "/login") {
            const confirmLogout = window.confirm("Ya iniciaste sesión.  ¿Deseas cerrar sesión?");
            if (confirmLogout) {
                logout(); // Borra token y usuario
                // Se queda en login
            } else {
                navigate(`/${user.role}`); // Redirige de vuelta a su dashboard
            }
        }
    }, [location.pathname]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            loginUser(response.data.user);

            const role = response.data.user.role;
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "vendedor") {
                navigate("/vendedor");
            } else if (role === "cliente") {
                navigate("/cliente");
            } else {
                navigate("/");
            }
        } catch (error) {
            alert("Error en login: " + error.response?.data?.error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-box">
                    <h2 style={{color: "black"}}>Iniciar Sesión</h2>
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
                    <p style={{cursor: "pointer", color: "blue"}} onClick={() => navigate("/forgot-password")}>
                        ¿Olvidaste tu contraseña?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
