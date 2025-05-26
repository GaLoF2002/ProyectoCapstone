import mongoose from 'mongoose';

const visitaClienteSchema = new mongoose.Schema({
    propiedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Propiedad',
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tipo: String, // ejemplo: "casa", "departamento"
    habitaciones: Number,
    parqueaderos: Number,
    timestamp: {
        type: Date,
        default: Date.now

    },
    duracionSegundos: {
        type: Number,
        default: 0 // tiempo que el cliente permaneció viendo la propiedad
    }

});

export default mongoose.model('VisitaCliente', visitaClienteSchema);
