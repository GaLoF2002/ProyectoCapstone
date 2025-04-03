// models/Propiedad.js
import mongoose from "mongoose";

const propiedadSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    ubicacion: { type: String, required: true },
    metrosCuadrados: { type: Number, required: true },
    parqueaderos: { type: Number, required: true },
    habitaciones: { type: Number, required: true },
    banos: { type: Number, required: true },
    tipo: { type: String, enum: ["casa", "departamento", "terreno"], required: true },
    estado: { type: String, enum: ["disponible", "reservado", "vendido"], default: "disponible" },
    imagenes: [{ type: String }],
    caracteristicas: [{ type: String }],
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});

export default mongoose.model("Propiedad", propiedadSchema);
