import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    getMisCitas,
    cambiarEstadoCita,
    getDisponibilidadPorVendedor
} from "../services/agendamientoService";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const GestionarCitasVendedor = () => {
    const { user } = useContext(AuthContext);
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [horasOcupadas, setHorasOcupadas] = useState({});

    // 🔍 LOG DE USER
    console.log("👤 User en componente:", user);

    const obtenerCitas = async () => {
        console.log("🚀 Ejecutando obtenerCitas");
        try {
            const res = await getMisCitas();
            console.log("📊 Datos de getMisCitas:", res.data);

            const pendientes = res.data.filter(c => c.estado === "pendiente");
            setCitasPendientes(pendientes);

            // Procesar horas ocupadas
            const ocupadas = {};
            res.data.filter(c => c.estado === "aceptada").forEach(c => {
                const dia = new Date(c.fecha).toLocaleString("es-EC", { weekday: "long" });
                if (!ocupadas[dia]) ocupadas[dia] = [];
                ocupadas[dia].push({ hora: c.hora, propiedad: c.propiedad.titulo });
            });
            setHorasOcupadas(ocupadas);
        } catch (error) {
            console.error("❌ Error al obtener citas:", error.response ? error.response.data : error.message);
        }
    };

    const obtenerDisponibilidad = async () => {
        try {
            const res = await getDisponibilidadPorVendedor(user._id);
            console.log("📅 Disponibilidad obtenida:", res.data);
            setDisponibilidad(res.data);
        } catch (error) {
            console.error("❌ Error al obtener disponibilidad:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        console.log("🔥 useEffect ejecutado - User:", user);

        if (user && user._id) {
            console.log("✅ User._id está definido:", user._id);
            obtenerCitas();
            obtenerDisponibilidad();
        } else {
            console.log("⚠️ User no está definido o no tiene _id");
        }
    }, [user]);

    const manejarCita = async (id, estado) => {
        await cambiarEstadoCita(id, estado);
        await obtenerCitas();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Mis Citas Pendientes</h2>
            {citasPendientes.length === 0 ? (
                <p>No tienes citas pendientes.</p>
            ) : (
                <ul>
                    {citasPendientes.map(c => (
                        <li key={c._id}>
                            {new Date(c.fecha).toLocaleDateString()} a las {c.hora} -
                            <strong> Propiedad:</strong> {c.propiedad.titulo} -
                            <strong> Cliente:</strong> {c.cliente.name}
                            <button onClick={() => manejarCita(c._id, "aceptada")}>Aceptar</button>
                            <button onClick={() => manejarCita(c._id, "cancelada")}>Rechazar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Mi Calendario Semanal</h2>
            {diasSemana.map(dia => {
                const disp = disponibilidad.find(d => d.diaSemana === dia);
                if (!disp) return null;

                const horasDisponibles = [];
                let inicio = parseInt(disp.horaInicio.split(":")[0]);
                let fin = parseInt(disp.horaFin.split(":")[0]);

                for (let h = inicio; h <= fin; h++) {
                    const horaTexto = `${h.toString().padStart(2, '0')}:00`;
                    const ocupado = horasOcupadas[dia]?.find(h => h.hora === horaTexto);
                    horasDisponibles.push(
                        <span key={horaTexto} style={{
                            marginRight: "1rem",
                            color: ocupado ? "red" : "green",
                            fontWeight: "bold"
                        }}>
                            {horaTexto} {ocupado ? `(${ocupado.propiedad})` : ""}
                        </span>
                    );
                }

                return (
                    <div key={dia} style={{ marginBottom: "1rem" }}>
                        <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}</strong>: {horasDisponibles}
                    </div>
                );
            })}
        </div>
    );
};

export default GestionarCitasVendedor;
