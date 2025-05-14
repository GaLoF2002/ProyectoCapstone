import React, { useEffect, useState, useContext } from "react";
import { getMisCitas, reagendarCita, getDisponibilidadPorVendedor } from "../services/agendamientoService";
import { AuthContext } from "../context/AuthContext";
import "./MisCitasCliente.css";

const MisCitasCliente = () => {
    const { user } = useContext(AuthContext);
    const [citas, setCitas] = useState([]);
    const [citaReagendando, setCitaReagendando] = useState(null);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [horaSeleccionada, setHoraSeleccionada] = useState("");

    useEffect(() => {
        const cargarCitas = async () => {
            try {
                const res = await getMisCitas();
                const activas = res.data.filter(c => c.estado !== "cancelada");
                setCitas(activas);
                console.log("📋 Citas cargadas:", activas);
            } catch (error) {
                console.error("❌ Error al cargar citas:", error);
                alert("Error al cargar tus citas, intenta más tarde");
            }
        };
        cargarCitas();
    }, []);

    const abrirReagendar = async (cita) => {
        try {
            const res = await getDisponibilidadPorVendedor(cita.vendedor._id);
            setDisponibilidad(res.data);
            setCitaReagendando(cita);
            setFechaSeleccionada(""); // Resetea la selección al abrir
            setHoraSeleccionada("");   // Resetea la selección al abrir
            console.log("🕒 Disponibilidad cargada para reagendar:", res.data);
        } catch (error) {
            console.error("❌ Error al cargar disponibilidad:", error);
            alert("Error al cargar la disponibilidad del vendedor");
        }
    };

    const estaDisponible = (fecha, hora, diaSemana) => {
        const disp = disponibilidad.find(d => d.diaSemana === diaSemana);
        if (!disp) return false;

        const horaNum = parseInt(hora.split(":")[0]);
        const horaInicioNum = parseInt(disp.horaInicio.split(":")[0]);
        const horaFinNum = parseInt(disp.horaFin.split(":")[0]);

        const dentroHorario = horaNum >= horaInicioNum && horaNum < horaFinNum;

        const citasVendedor = citas.filter(
            c =>
                c.vendedor._id === citaReagendando.vendedor._id &&
                c.estado !== "cancelada" &&
                c._id !== citaReagendando._id
        );

        const ocupada = citasVendedor.some(
            c => c.fecha.slice(0, 10) === fecha && normalizarHora(c.hora) === hora
        );

        return dentroHorario && !ocupada;
    };

    const normalizarHora = (h) => {
        const [hora, minuto = "00"] = h.split(":");
        return `${hora.padStart(2, "0")}:${minuto.padStart(2, "0")}`;
    };

    const confirmarReagendar = async () => {
        if (!fechaSeleccionada || !horaSeleccionada) {
            alert("Selecciona fecha y hora");
            return;
        }

        try {
            console.log("📨 Enviando solicitud para reagendar:", {
                id: citaReagendando._id,
                fecha: fechaSeleccionada,
                hora: horaSeleccionada
            });

            await reagendarCita(citaReagendando._id, fechaSeleccionada, horaSeleccionada);
            alert("✅ Cita reagendada correctamente");
            setCitaReagendando(null);
            setFechaSeleccionada("");
            setHoraSeleccionada("");

            const res = await getMisCitas();
            const activas = res.data.filter(c => c.estado !== "cancelada");
            setCitas(activas);
            console.log("📋 Citas actualizadas tras reagendar");
        } catch (error) {
            console.error("❌ Error al reagendar cita:", error.response?.data || error.message);
            alert(`Error al reagendar: ${error.response?.data?.msg || "intenta más tarde"}`);
        }
    };

    return (
        <div className="mis-citas-cliente">
            <h2>Mis Citas</h2>
            {citas.map(cita => (
                <div key={cita._id} className="cita-card">
                    <p><strong>Propiedad:</strong> {cita.propiedad?.titulo}</p>
                    <p><strong>Fecha:</strong> {cita.fecha.slice(0, 10)}</p>
                    <p><strong>Hora:</strong> {cita.hora}</p>
                    <p><strong>Estado:</strong> {cita.estado}</p>
                    {cita.estado === "aceptada" && (
                        <button onClick={() => abrirReagendar(cita)}>Reagendar</button>
                    )}
                </div>
            ))}

            {citaReagendando && (
                <div className="reagendar-panel">
                    <h3>Reagendar cita para: {citaReagendando.propiedad?.titulo}</h3>

                    <div className="reagendar-scroll-wrapper">
                        <div className="dias-reagendar-wrapper">
                            {generarSieteDias().map(dia => (
                                <div key={dia.fecha} className="dia-container">
                                    <h4>{dia.diaSemana} - {dia.fecha}</h4>
                                    <div className="horas-disponibles">
                                        {generarHoras("08:00", "18:00").map(hora => {
                                            const disponible = estaDisponible(dia.fecha, hora, dia.diaSemana);
                                            const esSeleccionada = fechaSeleccionada === dia.fecha && horaSeleccionada === hora;
                                            return (
                                                <button
                                                    key={hora}
                                                    onClick={() => {
                                                        if (disponible) {
                                                            setFechaSeleccionada(dia.fecha);
                                                            setHoraSeleccionada(hora);
                                                            console.log(`🟢 Seleccionado: ${dia.fecha} a las ${hora}`);
                                                        }
                                                    }}
                                                    className={`hora-boton ${disponible ? "disponible" : "ocupado"} ${esSeleccionada ? "seleccionada" : ""}`}
                                                    disabled={!disponible}
                                                >
                                                    {hora}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={confirmarReagendar} className="confirmar-reagendamiento-btn">
                        Confirmar nuevo horario
                    </button>
                </div>

            )}
        </div>
    );
};

const generarSieteDias = () => {
    const dias = [];
    const nombresDias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    for (let i = 0; i < 7; i++) {
        const fechaObj = new Date();
        fechaObj.setDate(fechaObj.getDate() + i);
        const diaSemana = nombresDias[fechaObj.getDay()];
        // Asegúrate de que la fecha esté en formato YYYY-MM-DD
        const anio = fechaObj.getFullYear();
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Meses son 0-indexados
        const diaDelMes = fechaObj.getDate().toString().padStart(2, '0');
        const fechaStr = `${anio}-${mes}-${diaDelMes}`;
        dias.push({ diaSemana, fecha: fechaStr });
    }
    return dias;
};


const generarHoras = (inicio, fin) => {
    const horas = [];
    let hIni = parseInt(inicio.split(":")[0]);
    const hFin = parseInt(fin.split(":")[0]);
    while (hIni < hFin) {
        horas.push(`${hIni.toString().padStart(2, "0")}:00`);
        hIni++;
    }
    return horas;
};

export default MisCitasCliente;