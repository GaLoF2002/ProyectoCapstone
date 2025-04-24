import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    crearDisponibilidad,
    getDisponibilidadPorVendedor
} from "../services/agendamientoService";
import "./AgendamientoVendedor.css"; // Importa el archivo de estilos

const AgendamientoVendedor = () => {
    const { user } = useContext(AuthContext);

    const [diaSemana, setDiaSemana] = useState("lunes");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState(null); // 'success' o 'error'

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => {
            setMensaje(null);
            setTipoMensaje(null);
        }, 3000);
    };

    const guardarDisponibilidad = async () => {
        if (!diaSemana || !horaInicio || !horaFin) {
            mostrarMensaje("⚠️ Debes llenar todos los campos", "error");
            return;
        }

        try {
            const data = { diaSemana, horaInicio, horaFin };
            console.log("Enviando datos:", data);
            await crearDisponibilidad(data);

            mostrarMensaje("✅ Disponibilidad guardada correctamente", "success");

            setDiaSemana("lunes");
            setHoraInicio("");
            setHoraFin("");

            obtenerDisponibilidad();
        } catch (error) {
            console.error("Error al guardar disponibilidad:", error);
            mostrarMensaje(error.response?.data?.msg || "❌ Error al guardar disponibilidad", "error");
        }
    };

    const obtenerDisponibilidad = async () => {
        try {
            if (!user || !user._id) return;
            const res = await getDisponibilidadPorVendedor(user._id);
            setDisponibilidad(res.data);
        } catch (err) {
            console.error("Error obteniendo disponibilidad:", err);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            obtenerDisponibilidad();
        }
    }, [user]);

    return (
        <div className="agendamiento-vendedor-container">
            <h2>Configuración de Disponibilidad</h2>

            {mensaje && (
                <div className={`mensaje ${tipoMensaje}`}>
                    {mensaje}
                </div>
            )}

            <div className="formulario-disponibilidad">
                <div className="campo-disponibilidad campo-dia-semana">
                    <label htmlFor="diaSemana">Día de la semana:</label>
                    <select
                        id="diaSemana"
                        value={diaSemana}
                        onChange={(e) => setDiaSemana(e.target.value)}
                    >
                        <option value="lunes">Lunes</option>
                        <option value="martes">Martes</option>
                        <option value="miércoles">Miércoles</option>
                        <option value="jueves">Jueves</option>
                        <option value="viernes">Viernes</option>
                        <option value="sábado">Sábado</option>
                        <option value="domingo">Domingo</option>
                    </select>
                </div>

                <div className="campo-disponibilidad campo-hora-inicio">
                    <label htmlFor="horaInicio">Hora de inicio:</label>
                    <input
                        type="time"
                        id="horaInicio"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                    />
                </div>

                <div className="campo-disponibilidad campo-hora-fin">
                    <label htmlFor="horaFin">Hora de fin:</label>
                    <input
                        type="time"
                        id="horaFin"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                    />
                </div>

                <button onClick={guardarDisponibilidad} className="boton-guardar">
                    Guardar Disponibilidad
                </button>
            </div>

            <div className="disponibilidad-registrada">
                <h3>Mi disponibilidad registrada:</h3>
                {disponibilidad.length === 0 ? (
                    <p className="sin-disponibilidad">No tienes disponibilidad configurada aún.</p>
                ) : (
                    <ul className="lista-disponibilidad">
                        {disponibilidad.map((item) => (
                            <li key={item._id} className="item-disponibilidad">
                                <strong>{item.diaSemana}</strong>: {item.horaInicio} - {item.horaFin}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AgendamientoVendedor;