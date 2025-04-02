import { useState } from "react";
import { crearPropiedad } from "../services/propiedadService";

const CrearPropiedad = ({ setActiveSection }) => {
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        precio: 0,
        ubicacion: "",
        metrosCuadrados: 0,
        parqueaderos: 0,
        habitaciones: 0,
        banos: 0,
        tipo: "casa",
        estado: "disponible",
        imagenes: [],
        caracteristicas: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCaracteristicas = (e) => {
        const value = e.target.value.split(",");
        setForm({ ...form, caracteristicas: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearPropiedad(form);
            alert("Propiedad creada correctamente");
            setActiveSection("propiedades");
        } catch (error) {
            console.error("Error al crear propiedad", error);
            alert("Error al crear propiedad");
        }
    };

    return (
        <div>
            <h2>Crear Nueva Propiedad</h2>
            <form onSubmit={handleSubmit}>
                <input name="titulo" placeholder="Título" onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
                <input name="precio" type="number" placeholder="Precio" onChange={handleChange} required />
                <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} required />
                <input name="metrosCuadrados" type="number" placeholder="Metros cuadrados" onChange={handleChange} required />
                <input name="parqueaderos" type="number" placeholder="Parqueaderos" onChange={handleChange} required />
                <input name="habitaciones" type="number" placeholder="Habitaciones" onChange={handleChange} required />
                <input name="banos" type="number" placeholder="Baños" onChange={handleChange} required />
                <select name="tipo" onChange={handleChange} required>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                </select>
                <select name="estado" onChange={handleChange}>
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                </select>
                <input name="imagenes" placeholder="URL de imágenes separadas por coma" onChange={(e) => setForm({ ...form, imagenes: e.target.value.split(",") })} />
                <input name="caracteristicas" placeholder="Características separadas por coma" onChange={handleCaracteristicas} />

                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setActiveSection("propiedades")}>Cancelar</button>
            </form>
        </div>
    );
};

export default CrearPropiedad;
