// controllers/citaController.js
import Cita from "../models/Cita.js";
import DisponibilidadVendedor from "../models/DisponibilidadVendedor.js";
import Propiedad from "../models/Propiedad.js";
import Notificacion from "../models/Notificacion.js";

// Utilidad: Verifica si hay conflicto con disponibilidad y otras citas
const esHoraDisponible = async (vendedorId, fecha, hora) => {
    // Día de la semana en español (en minúscula)
    const diaSemana = new Date(`${fecha}T12:00:00`).toLocaleString("es-EC", {
        weekday: "long"
    }).toLowerCase();
    const disponibilidad = await DisponibilidadVendedor.findOne({ vendedor: vendedorId, diaSemana });
    if (!disponibilidad) {
        console.log("⛔ No hay disponibilidad registrada para:", vendedorId, diaSemana);
        return false;
    }
    console.log("🔍 Día buscado:", diaSemana);
    console.log("📊 Comparando:", { hora, horaInicio: disponibilidad.horaInicio, horaFin: disponibilidad.horaFin });

    // 🔁 Convertimos las horas a minutos
    console.log(disponibilidad)
    const horaToMin = (h) => {
        const [hrs, mins] = h.split(":").map(Number);
        return hrs * 60 + mins;
    };

    const minSeleccionada = horaToMin(hora);
    const minInicio = horaToMin(disponibilidad.horaInicio);
    const minFin = horaToMin(disponibilidad.horaFin);

    // ⛔ Excluye el rango si está fuera
    if (minSeleccionada < minInicio || minSeleccionada >= minFin) {
        console.log("⛔ Hora fuera del rango:", hora, disponibilidad.horaInicio, disponibilidad.horaFin);
        return false;
    }
    // 🔄 Revisar que no haya otra cita a esa hora y día
    const citaExistente = await Cita.findOne({
        vendedor: vendedorId,
        fecha,
        hora,
        estado: { $ne: "cancelada" }
    });
    if (citaExistente) {
        console.log("⛔ Ya hay una cita agendada en esa hora:", citaExistente);
        return false;
    }
    return true;
};

// Crear una cita
export const crearCita = async (req, res) => {
    try {
        const { propiedad, fecha, hora, mensaje } = req.body;
        const clienteId = req.user._id;

        const propiedadInfo = await Propiedad.findById(propiedad);
        if (!propiedadInfo) return res.status(404).json({ msg: "Propiedad no encontrada" });

        const vendedorId = propiedadInfo.creadoPor;

        const disponible = await esHoraDisponible(vendedorId, fecha, hora);
        if (!disponible) return res.status(400).json({ msg: "La hora seleccionada no está disponible" });

        const nuevaCita = new Cita({
            propiedad,
            vendedor: vendedorId,
            cliente: clienteId,
            fecha,
            hora,
            mensaje
        });

        await nuevaCita.save();
        await Notificacion.create({
            usuario: vendedorId,
            mensaje: `Has recibido una nueva solicitud de cita para tu propiedad "${propiedadInfo.titulo}".`,
            tipo: "cita"
        });
        res.status(201).json({ msg: "Cita creada correctamente", cita: nuevaCita });
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ error: "Error al crear cita" });
    }
};

// Obtener citas por usuario logueado (cliente o vendedor)
// Obtener citas por usuario logueado (cliente o vendedor)
export const obtenerMisCitas = async (req, res) => {
    try {
        const rol = req.user.role;
        const userId = req.user._id;
        const query = rol === "vendedor" ? { vendedor: userId } : { cliente: userId };

        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);

        const manana = new Date(hoy);
        manana.setUTCDate(hoy.getUTCDate() + 1);

        const citas = await Cita.find({
            ...query,
            fecha: { $gte: hoy }
        })
            .populate("propiedad", "titulo")
            .populate("cliente", "name")
            .populate("vendedor", "name");

        const hoyStr = hoy.toISOString().split("T")[0];
        const mananaStr = manana.toISOString().split("T")[0];

        for (const cita of citas) {
            if (cita.estado === "cancelada") continue;

            const ahora = new Date();
            const citaFechaHora = new Date(`${cita.fecha.toISOString().split("T")[0]}T${cita.hora}`);

            if (citaFechaHora < ahora) continue;

            const fechaStr = cita.fecha.toISOString().split("T")[0];
            let tipoMensaje = null;

            if (fechaStr === hoyStr) tipoMensaje = "Hoy tienes una cita";
            else if (fechaStr === mananaStr) tipoMensaje = "Mañana tienes una cita";

            if (tipoMensaje) {
                const mensajeExacto = `${tipoMensaje} con hora ${cita.hora} en la propiedad "${cita.propiedad.titulo}".`;

                const yaExiste = await Notificacion.findOne({
                    usuario: userId,
                    mensaje: mensajeExacto,
                    tipo: "recordatorio",
                    leida: false
                });

                if (!yaExiste) {
                    await Notificacion.create({
                        usuario: userId,
                        mensaje: mensajeExacto,
                        tipo: "recordatorio"
                    });
                }
            }
        }

        res.json(citas);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: "Error al obtener citas" });
    }
};


// Cambiar estado de cita
export const cambiarEstadoCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const cita = await Cita.findById(id);
        cita.estado = estado;
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

        cita.estado = estado;
        await cita.save();
        await Notificacion.create({
            usuario: cita.cliente,
            mensaje: `Tu cita fue ${estado}.`,
            tipo: "cita"
        });

        res.json({ msg: `Cita ${estado} correctamente`, cita });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar estado de la cita" });
    }
};

// Eliminar una cita
export const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findById(id);
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

        await cita.deleteOne();
        res.json({ msg: "Cita eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar cita" });
    }
};

// Reagendar una cita
export const reagendarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevaFecha, nuevaHora } = req.body;

        const cita = await Cita.findById(id);
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

        // Solo el cliente puede reagendar su propia cita
        if (String(cita.cliente) !== String(req.user._id)) {
            return res.status(403).json({ msg: "No tienes permiso para reagendar esta cita" });
        }

        // Verificar disponibilidad del nuevo horario
        const disponible = await esHoraDisponible(cita.vendedor, nuevaFecha, nuevaHora);
        if (!disponible) {
            return res.status(400).json({ msg: "La nueva hora seleccionada no está disponible" });
        }

        cita.fecha = nuevaFecha;
        cita.hora = nuevaHora;
        cita.estado = "pendiente"; // Opcional: vuelve a estado pendiente

        await cita.save();
        res.json({ msg: "Cita reagendada correctamente", cita });
    } catch (error) {
        console.error("Error al reagendar cita:", error);
        res.status(500).json({ error: "Error al reagendar cita" });
    }
};
