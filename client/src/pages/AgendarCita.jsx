import React, { useEffect, useState, useContext } from "react";
import { getPropiedadPorId } from "../services/propiedadService";
import { getDisponibilidadPorVendedor, getMisCitas, crearCita } from "../services/agendamientoService";
import { AuthContext } from "../context/AuthContext";
import "./AgendarCita.css"; // Importa el archivo de estilos

const AgendarCita = ({ propiedadId, setActiveSection }) => {
    const { user } = useContext(AuthContext);
    const [propiedad, setPropiedad] = useState(null);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [citasExistentes, setCitasExistentes] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [horaSeleccionada, setHoraSeleccionada] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resProp = await getPropiedadPorId(propiedadId);
                setPropiedad(resProp.data);

                const vendedorId = resProp.data.creadoPor._id;
                const resDisp = await getDisponibilidadPorVendedor(vendedorId);
                setDisponibilidad(resDisp.data);

                const resCitas = await getMisCitas(); // Podrías filtrar por vendedor si es necesario
                setCitasExistentes(resCitas.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

        if (propiedadId) {
            cargarDatos();
        }
    }, [propiedadId]);

    const diasSiguientes = generarSieteDias();

    const confirmarCita = async () => {
        try {
            if (!fechaSeleccionada || !horaSeleccionada) {
                alert("Debes seleccionar fecha y hora");
                return;
            }

            await crearCita({
                propiedad: propiedad._id,
                fecha: fechaSeleccionada,
                hora: horaSeleccionada,
                mensaje: "Me gustaría visitar la propiedad"
            });

            setMensaje("✅ ¡Cita agendada correctamente!");

            setTimeout(() => {
                setActiveSection("ver-propiedad");
            }, 2000);
        } catch (error) {
            console.error("Error al agendar cita:", error);
            alert("❌ Error al agendar cita");
        }
    };

    const estaDisponible = (fecha, hora, diaSemana) => {
        const disponible = disponibilidad.find((d) => d.diaSemana === diaSemana);
        if (!disponible) return false;

        const dentroHorario = hora >= disponible.horaInicio && hora < disponible.horaFin;
        const citaExiste = citasExistentes.some(c =>
            c.fecha.slice(0, 10) === fecha && c.hora === hora && c.estado !== "cancelada"
        );

        return dentroHorario && !citaExiste;
    };

    if (!propiedad) return <p>Cargando información de la propiedad...</p>;

    return (
        <div className="agendar-cita-container">
            <h2 className="agendar-cita-titulo">Agendar Cita para: {propiedad.titulo}</h2>

            <div className="calendario-container">
                {diasSiguientes.map((dia) => (
                    <div key={dia.fecha} className="dia-container">
                        <h3 className="dia-titulo">{dia.diaSemana} ({dia.fecha})</h3>
                        <div className="horas-container">
                            {generarHoras("08:00", "18:00").map((hora) => {
                                const disponible = estaDisponible(dia.fecha, hora, dia.diaSemana);
                                return (
                                    <button
                                        key={`${dia.fecha}-${hora}`}
                                        className={`hora-boton ${disponible ? 'disponible' : 'no-disponible'}`}
                                        disabled={!disponible}
                                        onClick={() => {
                                            setFechaSeleccionada(dia.fecha);
                                            setHoraSeleccionada(hora);
                                        }}
                                    >
                                        {hora}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {fechaSeleccionada && horaSeleccionada && (
                <div className="seleccion-cita-confirmacion">
                    <p>Seleccionaste: <strong>{fechaSeleccionada} a las {horaSeleccionada}</strong></p>
                    <div className="confirmacion-container">
                        <button className="confirmar-boton" onClick={confirmarCita}>Confirmar Cita</button>
                        <button className="cancelar-boton" onClick={() => setActiveSection("ver-propiedad")}>Cancelar</button>
                        {mensaje && <p className="mensaje-cita-confirmacion">{mensaje}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

// Generar los próximos 7 días
const generarSieteDias = () => {
    const dias = [];
    const nombresDias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    for (let i = 0; i < 7; i++) {
        const fechaObj = new Date();
        fechaObj.setDate(fechaObj.getDate() + i);
        const diaSemana = nombresDias[fechaObj.getDay()];
        const fechaStr = fechaObj.toISOString().slice(0, 10); // YYYY-MM-DD
        dias.push({ diaSemana, fecha: fechaStr });
    }
    return dias;
};

// Generar horas entre dos horas (por hora completa)
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

export default AgendarCita;