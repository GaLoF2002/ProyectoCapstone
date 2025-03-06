import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const crearVendedor = async (req, res) => {
        const { name, email, password, phone } = req.body;
        try {
                const userExists = await User.findOne({ email });
                if (userExists) {
                        return res.status(400).json({ error: "El usuario ya existe" });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const seller = new User({
                        name,
                        email,
                        password: hashedPassword,
                        phone, // 📌 Guardar el celular del vendedor
                        role: "vendedor"
                });

                await seller.save();
                res.status(201).json({ message: "Vendedor creado correctamente" });
        } catch (error) {
                res.status(500).json({ error: "Error al crear el vendedor" });
        }
};



export const obtenerVendedores = async (req, res) => {
        try {
                const sellers = await User.find({ role: "vendedor" }).select("-password");
                res.json(sellers);
        } catch (error) {
                res.status(500).json({ error: "Error al obtener los vendedores" });
        }
};

export const actualizarVendedor = async (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;

        try {
                const seller = await User.findById(id);
                if (!seller) {
                        return res.status(404).json({ error: "Vendedor no encontrado" });
                }

                seller.name = name || seller.name;
                seller.email = email || seller.email;
                await seller.save();

                res.json({ message: "Vendedor actualizado correctamente" });
        } catch (error) {
                res.status(500).json({ error: "Error al actualizar el vendedor" });
        }
};
