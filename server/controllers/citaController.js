// controllers/citaController.js
import Cita from "../models/Cita.js";
import DisponibilidadVendedor from "../models/DisponibilidadVendedor.js";
import Propiedad from "../models/Propiedad.js";

// Utilidad: Verifica si hay conflicto con disponibilidad y otras citas
const esHoraDisponible = async (vendedorId, fecha, hora) => {
    const diaSemana = new Date(fecha).toLocaleString("es-EC", { weekday: "long" });

    const disponibilidad = await DisponibilidadVendedor.findOne({ vendedor: vendedorId, diaSemana });
    if (!disponibilidad) return false;

    if (hora < disponibilidad.horaInicio || hora > disponibilidad.horaFin) return false;

    const citaExistente = await Cita.findOne({ vendedor: vendedorId, fecha, hora, estado: { $ne: "cancelada" } });
    if (citaExistente) return false;

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
        const query = rol === "vendedor" ? { vendedor: req.user._id } : { cliente: req.user._id };

        const citas = await Cita.find(query)
            .populate("propiedad", "titulo")  // Solo trae el título de la propiedad
            .populate("cliente", "name")      // Solo trae el nombre del cliente
            .populate("vendedor", "name");    // Trae nombre del vendedor si quieres mostrar

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
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

        cita.estado = estado;
        await cita.save();

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
