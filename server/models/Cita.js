// models/Cita.js
import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
    propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propiedad",
        required: true
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String, // ejemplo "10:00"
        required: true
    },
    estado: {
        type: String,
        enum: ["pendiente", "aceptada", "cancelada"],
        default: "pendiente"
    },
    mensaje: {
        type: String
    },
    recordatorioEnviado: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model("Cita", citaSchema);
