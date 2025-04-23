import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    crearDisponibilidad,
    getDisponibilidadPorVendedor
} from "../services/agendamientoService";

const AgendamientoVendedor = () => {
    const { user } = useContext(AuthContext);

    const [diaSemana, setDiaSemana] = useState("lunes");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [disponibilidad, setDisponibilidad] = useState([]);

    const guardarDisponibilidad = async () => {
        if (!diaSemana || !horaInicio || !horaFin) {
            alert("⚠️ Debes llenar todos los campos");
            return;
        }

        try {
            const data = { diaSemana, horaInicio, horaFin };
            console.log("Enviando datos:", data); // <- Útil para debug
            await crearDisponibilidad(data);

            alert("✅ Disponibilidad guardada correctamente");

            setDiaSemana("lunes");
            setHoraInicio("");
            setHoraFin("");

            obtenerDisponibilidad();
        } catch (error) {
            console.error("Error al guardar disponibilidad:", error);
            alert(error.response?.data?.msg || "❌ Error al guardar disponibilidad");
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
        <div style={{ padding: "2rem" }}>
            <h2>Configuración de Disponibilidad</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)}>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miércoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Viernes</option>
                    <option value="sábado">Sábado</option>
                    <option value="domingo">Domingo</option>
                </select>

                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
                <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                />

                <button onClick={guardarDisponibilidad}>Guardar Disponibilidad</button>
            </div>

            <h3>Mi disponibilidad registrada:</h3>
            {disponibilidad.length === 0 ? (
                <p>No tienes disponibilidad configurada aún.</p>
            ) : (
                <ul>
                    {disponibilidad.map((item) => (
                        <li key={item._id}>
                            <strong>{item.diaSemana}</strong>: {item.horaInicio} - {item.horaFin}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AgendamientoVendedor;
