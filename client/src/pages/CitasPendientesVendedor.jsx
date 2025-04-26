import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMisCitas, cambiarEstadoCita, getDisponibilidadPorVendedor } from "../services/agendamientoService";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const CitasPendientesVendedor = () => {
    const { user } = useContext(AuthContext);
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [citasAceptadas, setCitasAceptadas] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);

    const obtenerCitas = async () => {
        console.log("🚀 Ejecutando obtenerCitas");
        try {
            const res = await getMisCitas();
            console.log("📊 Todas las citas que llegan:", res.data);

            const pendientes = res.data.filter(c => c.estado === "pendiente");
            const aceptadas = res.data.filter(c => c.estado === "aceptada");

            setCitasPendientes(pendientes);
            setCitasAceptadas(aceptadas);
        } catch (error) {
            console.error("❌ Error al obtener citas:", error.response ? error.response.data : error.message);
        }
    };

    const obtenerDisponibilidad = async () => {
        try {
            const vendedorId = user._id || user.id;
            const res = await getDisponibilidadPorVendedor(vendedorId);
            console.log("🟢 Disponibilidad:", res.data);
            setDisponibilidad(res.data);
        } catch (error) {
            console.error("❌ Error al obtener disponibilidad:", error);
        }
    };

    const manejarCita = async (id, estado) => {
        try {
            await cambiarEstadoCita(id, estado);
            await obtenerCitas();  // Actualiza citas pendientes y aceptadas
        } catch (error) {
            console.error(`❌ Error al cambiar estado de la cita:`, error);
        }
    };

    useEffect(() => {
        if (user && (user._id || user.id)) {
            console.log("👤 User detectado:", user);
            obtenerCitas();
            obtenerDisponibilidad();
        }
    }, [user]);

    // 🗓️ Generar horario por día
    const renderHorario = () => {
        return diasSemana.map(dia => {
            const disp = disponibilidad.find(d => d.diaSemana === dia);
            if (!disp) return null;

            let inicio = parseInt(disp.horaInicio.split(":")[0]);
            let fin = parseInt(disp.horaFin.split(":")[0]);

            const horas = [];
            for (let h = inicio; h <= fin; h++) {
                const horaTexto = `${h.toString().padStart(2, '0')}:00`;

                const cita = citasAceptadas.find(c => {
                    const citaDia = new Date(c.fecha).toLocaleString("es-EC", { weekday: "long" });
                    return citaDia === dia && c.hora === horaTexto;
                });

                horas.push(
                    <span key={horaTexto} style={{
                        marginRight: "1rem",
                        color: cita ? "red" : "green",
                        fontWeight: "bold"
                    }}>
                        {horaTexto} {cita ? `(${cita.propiedad.titulo})` : ""}
                    </span>
                );
            }

            return (
                <div key={dia} style={{ marginBottom: "1rem" }}>
                    <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}</strong>: {horas}
                </div>
            );
        });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📅 Citas Pendientes</h2>
            {citasPendientes.length === 0 ? (
                <p>No tienes citas pendientes.</p>
            ) : (
                <ul>
                    {citasPendientes.map(cita => (
                        <li key={cita._id} style={{ marginBottom: "1rem" }}>
                            <strong>Propiedad:</strong> {cita.propiedad.titulo} <br />
                            <strong>Cliente:</strong> {cita.cliente.name} <br />
                            <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()} <br />
                            <strong>Hora:</strong> {cita.hora} <br />
                            <strong>Mensaje:</strong> {cita.mensaje} <br />
                            <button onClick={() => manejarCita(cita._id, "aceptada")} style={{ marginRight: "1rem" }}>✅ Aceptar</button>
                            <button onClick={() => manejarCita(cita._id, "cancelada")}>❌ Rechazar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>🗓️ Mi Calendario Semanal</h2>
            {renderHorario()}
        </div>
    );
};

export default CitasPendientesVendedor;
