import mongoose from 'mongoose';

const evaluacionSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propiedadInteres: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Propiedad',
        required: true
    },

    // Información básica
    tipoCompra: {
        type: String,
        enum: ['contado', 'credito'],
        required: true
    },
    tiempoCompra: {
        type: String,
        enum: ['1mes', '2meses', '3meses', '4meses', '5meses', '6meses'],
        required: true
    },

    // Solo si tipoCompra === "credito"
    ingresos: {
        sueldo: Number,
        otros: Number,
        conyuge: Number,
        origenOtros: String
    },
    egresos: {
        alimentacion: Number,
        servicios: Number,
        arriendo: Number,
        educacion: Number,
        transporte: Number,
        salud: Number,
        vestimenta: Number,
        mantenimiento: Number,
        pagoEmpleados: Number,
        alquilerLocal: Number,
        deudas: Number,
        otros: Number
    },
    ahorroMensual: Number,

    buro: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E']
    },

    antiguedadAnios: Number,

    numeroInmuebles: Number,
    numeroVehiculos: Number,

    valorPropiedad: Number,

    // Puntaje automático
    nivelPotencial: { type: Number, min: 1, max: 7 },

    // Documentos de precalificación bancaria (solo crédito)
    documentos: [String]

}, { timestamps: true });

export default mongoose.model('EvaluacionCompra', evaluacionSchema);
