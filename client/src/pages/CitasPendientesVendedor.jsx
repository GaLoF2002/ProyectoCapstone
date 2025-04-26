import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMisCitas, cambiarEstadoCita, getDisponibilidadPorVendedor } from "../services/agendamientoService";
import "./CitasPendientesVendedor.css";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const horasDia = Array.from({ length: 16 }, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`); // Genera horas de 06:00 a 21:00

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

    const renderHorario = () => {
        const borderColor = '#ccc';
        const cellPaddingVertical = '0.2rem'; // Reducimos el padding vertical
        const cellPaddingHorizontal = '0.5rem';

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}` }}>
                    <thead>
                    <tr>
                        <th style={{ border: `1px solid ${borderColor}`, padding: '0.5rem', fontWeight: 'bold', color: 'black' }}></th>
                        {diasSemana.map(dia => (
                            <th key={dia} style={{ border: `1px solid ${borderColor}`, padding: '0.5rem', fontWeight: 'bold', color: 'black' }}>
                                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {horasDia.map(hora => (
                        <tr key={hora}>
                            <th style={{ border: `1px solid ${borderColor}`, padding: '0.5rem', fontWeight: 'bold', color: 'black' }}>{hora}</th>
                            {diasSemana.map(dia => {
                                const disp = disponibilidad.find(d => d.diaSemana === dia);
                                if (!disp) return <td key={`${dia}-${hora}`} style={{ border: `1px solid ${borderColor}`, padding: `${cellPaddingVertical} ${cellPaddingHorizontal}` }}></td>;

                                const cita = citasAceptadas.find(c => {
                                    const citaDia = new Date(c.fecha).toLocaleString("es-EC", { weekday: "long" });
                                    return citaDia === dia && c.hora === hora;
                                });

                                const horaInicioDisp = disp.horaInicio.split(':')[0];
                                const horaFinDisp = disp.horaFin.split(':')[0];
                                const horaActual = hora.split(':')[0];

                                const estaDisponible = parseInt(horaActual) >= parseInt(horaInicioDisp) && parseInt(horaActual) <= parseInt(horaFinDisp);
                                let contenido = '';
                                let color = 'black';

                                if (cita) {
                                    contenido = `(${cita.propiedad.titulo})`;
                                    color = 'red';
                                } else if (estaDisponible) {
                                    contenido = 'Libre';
                                    color = 'green';
                                }

                                return (
                                    <td key={`${dia}-${hora}`} style={{ border: `1px solid ${borderColor}`, padding: `${cellPaddingVertical} ${cellPaddingHorizontal}`, color: color, fontSize: '0.75rem', textAlign: 'center' }}>
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
                            <div>
                                <strong>Propiedad</strong>
                                <span>{cita.propiedad.titulo}</span>
                            </div>
                            <div>
                                <strong>Cliente</strong>
                                <span>{cita.cliente.name}</span>
                            </div>
                            <div>
                                <strong>Fecha</strong>
                                <span>{new Date(cita.fecha).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <strong>Hora</strong>
                                <span>{cita.hora}</span>
                            </div>
                            <div>
                                <strong>Mensaje</strong>
                                <span>{cita.mensaje}</span>
                            </div>
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

export default CitasPendientesVendedor;