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

    // 1. Datos personales
    nombres: String,
    cedula: String,
    edad: Number,
    estadoCivil: String,
    hijos: Number,
    nivelEducativo: {
        type: String,
        enum: ['Primaria', 'Secundaria', 'Bachillerato', 'Tercer nivel', 'Cuarto nivel', 'Postgrado']
    },
    celular: String,

    // 2. Información laboral
    tipoEmpleado: {
        type: String,
        enum: ['Dependiente', 'Independiente'],
        required: true
    },

    // Si es dependiente
    empleador: String,
    cargo: String,
    antiguedadAnios: Number,
    ingresoMensual: Number,
    bonificaciones: Number,

    // Si es independiente
    actividadEconomica: String,
    negocioNombre: String,
    localPropio: Boolean,
    empleados: Number,
    ventasMensuales: Number,
    comprasMensuales: Number,
    utilidadMensual: Number,
    ventasAnioAnterior: Number,
    ventasProyectadas: Number,

    // 3. Ingresos y egresos
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

    // 4. Información financiera
    tieneActivos: Boolean,
    numeroInmuebles: Number,
    numeroVehiculos: Number,

    tienePasivos: Boolean,
    detallePasivos: String, // si tiene pasivos, lo describe aquí

    // 5. Información bancaria
    tieneCuentaBancaria: Boolean,
    tipoCuenta: String,
    bancos: String,
    tieneTarjetasCredito: Boolean,
    tarjetas: String,
    tieneAtrasos: Boolean,
    buro: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E']
    },

    // 6. Cónyuge (opcional)
    conyuge: {
        nombre: String,
        profesion: String,
        cedula: String,
        relacionLaboral: String,
        actividad: String,
        ingreso: Number,
        deudas: String
    },

    // 7. Propiedad de interés
    valorPropiedad: Number,
    entradaInicial: Number,
    plazoCredito: Number,

    // 8. Puntaje
    nivelPotencial: { type: Number, min: 1, max: 5 },

    // Archivos
    documentos: [String]

}, { timestamps: true });

export default mongoose.model('EvaluacionCompra', evaluacionSchema);
