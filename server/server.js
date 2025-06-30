import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import User from "./models/User.js";
import bcrypt from 'bcryptjs';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes  from "./routes/userRoutes.js";
import propiedadRoutes from './routes/propiedadRoutes.js';
import agendamientoRoutes from './routes/agendamientoRoutes.js';
import evaluacionRoutes from "./routes/evaluacionRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import visitaRoutes from "./routes/visitaRoutes.js";
import indicadoresRoutes from "./routes/indicadoresRoutes.js";
import notificacionesRoutes from './routes/notificacionesRoutes.js';
import estadisticasCitasRoutes from './routes/estadisticasCitasRoutes.js';
import interesRoutes from "./routes/interesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();
connectDB();


const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const admin = new User({
                name: "Administrador",
                email: "admin@example.com",
                password: hashedPassword,
                phone: "1234567890",
                role: "admin"
            });
            await admin.save();
            console.log("Administrador creado: admin@example.com / admin123");
        }
    } catch (error) {
        console.error("Error creando el administrador:", error);
    }
};

createAdminUser();
// Administrador creado: admin@example.com / admin123


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/propiedades', propiedadRoutes);
app.use('/api/agendamiento', agendamientoRoutes);
app.use("/api/evaluacion", evaluacionRoutes);
app.use("/api/visitas", visitaRoutes);
app.use("/api/indicadores", indicadoresRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/estadisticas-citas', estadisticasCitasRoutes);
app.use("/api/interes", interesRoutes);

// Servir frontend de producción correctamente (desde /server/client)
app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
