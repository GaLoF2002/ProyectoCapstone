import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // 📌 Agregado campo de celular
    role: { type: String, default: 'cliente', enum: ['admin', 'vendedor', 'cliente'] }
});

export default mongoose.model('User', userSchema);
