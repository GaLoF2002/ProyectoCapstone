import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    getMisCitas,
    cambiarEstadoCita,
    getDisponibilidadPorVendedor
} from "../services/agendamientoService";
import "./CitasPendientesVendedor.css";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const horasDia = Array.from({ length: 16 }, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`);

const normalizar = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const igualHora = (hora1, hora2) => hora1.slice(0, 5) === hora2.slice(0, 5);

const CitasPendientesVendedor = () => {
    const { user } = useContext(AuthContext);
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [citasAceptadas, setCitasAceptadas] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);

    const obtenerCitas = async () => {
        try {
            const res = await getMisCitas();
            const pendientes = res.data.filter(c => c.estado === "pendiente");
            const aceptadas = res.data.filter(c => c.estado === "aceptada");
            setCitasPendientes(pendientes);
            setCitasAceptadas(aceptadas);
        } catch (error) {
            console.error("❌ Error al obtener citas:", error);
        }
    };

    const obtenerDisponibilidad = async () => {
        try {
            const vendedorId = user._id || user.id;
            const res = await getDisponibilidadPorVendedor(vendedorId);
            setDisponibilidad(res.data);
        } catch (error) {
            console.error("❌ Error al obtener disponibilidad:", error);
        }
    };

    const manejarCita = async (id, estado) => {
        try {
            await cambiarEstadoCita(id, estado);
            await obtenerCitas();
        } catch (error) {
            console.error(`❌ Error al cambiar estado:`, error);
        }
    };

    useEffect(() => {
        if (user && (user._id || user.id)) {
            obtenerCitas();
            obtenerDisponibilidad();
        }
    }, [user]);

    const renderHorario = () => {
        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={headerStyle}></th>
                        {diasSemana.map(dia => (
                            <th key={dia} style={headerStyle}>
                                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {horasDia.map(hora => (
                        <tr key={hora}>
                            <th style={cellStyle}>{hora}</th>
                            {diasSemana.map(dia => {
                                const disp = disponibilidad.find(d => d.diaSemana === dia);
                                if (!disp) {
                                    return <td key={`${dia}-${hora}`} style={cellStyle}></td>;
                                }

                                const citaAceptada = citasAceptadas.find(c => {
                                    const diaCita = normalizar(
                                        new Date(c.fecha).toLocaleString("es-EC", {
                                            weekday: "long",
                                            timeZone: "UTC"
                                        })
                                    );
                                    return normalizar(diaCita) === normalizar(dia) && igualHora(c.hora, hora);
                                });

                                const citaPendiente = citasPendientes.find(c => {
                                    const diaCita = normalizar(
                                        new Date(c.fecha).toLocaleString("es-EC", {
                                            weekday: "long",
                                            timeZone: "UTC"
                                        })
                                    );
                                    return normalizar(diaCita) === normalizar(dia) && igualHora(c.hora, hora);
                                });

                                const horaNum = parseInt(hora.split(":")[0]);
                                const inicio = parseInt(disp.horaInicio.split(":")[0]);
                                const fin = parseInt(disp.horaFin.split(":")[0]);

                                let contenido = "";
                                let color = "";

                                if (citaAceptada) {
                                    contenido = `✅ ${citaAceptada.propiedad.titulo}`;
                                    color = "red";
                                } else if (citaPendiente) {
                                    contenido = `🕒 ${citaPendiente.propiedad.titulo}`;
                                    color = "orange";
                                } else if (horaNum >= inicio && horaNum < fin) {
                                    contenido = "Libre";
                                    color = "green";
                                }

                                return (
                                    <td
                                        key={`${dia}-${hora}`}
                                        style={{
                                            ...cellStyle,
                                            color,
                                            fontSize: '0.75rem',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {contenido}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="vendedor-citas-pendientes-section">
            <h2>📅 Citas Pendientes</h2>
            {citasPendientes.length === 0 ? (
                <p>No tienes citas pendientes.</p>
            ) : (
                <div className="citas-grid-container">
                    {citasPendientes.map(cita => (
                        <div key={cita._id} className="cita-pendiente-item">
                            <div><strong>Propiedad:</strong> {cita.propiedad.titulo}</div>
                            <div><strong>Cliente:</strong> {cita.cliente.name}</div>
                            <div><strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString("es-EC", { timeZone: "UTC" })}</div>
                            <div><strong>Hora:</strong> {cita.hora}</div>
                            <div><strong>Mensaje:</strong> {cita.mensaje}</div>
                            <div className="citas-botones">
                                <button onClick={() => manejarCita(cita._id, "aceptada")}>Aceptar</button>
                                <button onClick={() => manejarCita(cita._id, "cancelada")}>Rechazar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2>🗓️ Mi Calendario Semanal</h2>
            {renderHorario()}
        </div>
    );
};

const headerStyle = {
    border: '1px solid #ccc',
    padding: '0.5rem',
    fontWeight: 'bold',
    color: 'black'
};

const cellStyle = {
    border: '1px solid #ccc',
    padding: '0.3rem',
    color: 'black'
};

export default CitasPendientesVendedor;
