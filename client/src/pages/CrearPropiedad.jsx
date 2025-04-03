import { useState } from "react";
import { crearPropiedad } from "../services/propiedadService";
import "./CrearPropiedad.css";

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
        <div className="crear-propiedad-container">
            <div className="crear-propiedad-form-container">
                <h2>Crear Nueva Propiedad</h2>
                <form className="crear-propiedad-form" onSubmit={handleSubmit}>
                    <div className="form-column">
                        <label>Título</label>
                        <input name="titulo" className="input-box" onChange={handleChange} required />

                        <label>Precio</label>
                        <input name="precio" type="number" className="input-box" onChange={handleChange} required />

                        <label>Ubicación</label>
                        <input name="ubicacion" className="input-box" onChange={handleChange} required />

                        <label>Metros cuadrados</label>
                        <input name="metrosCuadrados" type="number" className="input-box" onChange={handleChange} required />
                    </div>

                    <div className="form-column">
                        <label>Parqueaderos</label>
                        <input name="parqueaderos" type="number" className="input-box" onChange={handleChange} required />

                        <label>Habitaciones</label>
                        <input name="habitaciones" type="number" className="input-box" onChange={handleChange} required />

                        <label>Baños</label>
                        <input name="banos" type="number" className="input-box" onChange={handleChange} required />

                        <label>Tipo</label>
                        <select name="tipo" className="input-box" onChange={handleChange} required>
                            <option value="casa">Casa</option>
                            <option value="departamento">Departamento</option>
                            <option value="terreno">Terreno</option>
                        </select>
                    </div>

                    <div className="form-full">
                        <label>Estado</label>
                        <select name="estado" className="input-box" onChange={handleChange}>
                            <option value="disponible">Disponible</option>
                            <option value="reservado">Reservado</option>
                            <option value="vendido">Vendido</option>
                        </select>

                        <label>Características</label>
                        <input name="caracteristicas" className="input-box" onChange={handleCaracteristicas} />

                        <label>Descripción</label>
                        <textarea name="descripcion" className="input-box" onChange={handleChange} />

                        <label>URL de imágenes</label>
                        <input name="imagenes" className="input-box" onChange={(e) => setForm({ ...form, imagenes: e.target.value.split(",") })} />
                    </div>

                    <div className="button-group">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setActiveSection("propiedades")}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearPropiedad;
