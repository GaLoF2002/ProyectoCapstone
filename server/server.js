import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import User from "./models/User.js";
import bcrypt from 'bcryptjs';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes  from "./routes/userRoutes.js";


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

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
