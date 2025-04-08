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

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Agrega cada campo del formulario
            for (let key in form) {
                if (key === "imagenes") {
                    form.imagenes.forEach((file) => {
                        formData.append("imagenes", file); // nombre debe coincidir con el campo backend
                    });
                } else if (Array.isArray(form[key])) {
                    form[key].forEach((item) => formData.append(key, item));
                } else {
                    formData.append(key, form[key]);
                }
            }

            await crearPropiedad(formData); // aquí ya no mandas JSON plano, sino FormData
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
                        <input name="caracteristicas" className="input-long" onChange={handleCaracteristicas} />

                        <label>Descripción</label>
                        <textarea name="descripcion" className="input-long" onChange={handleChange} />

                        <div className="file-upload-container">
                            <label className="file-label">Imágenes (máx. 10)</label>
                            <input
                                className="choose-files"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);

                                    if (files.length > 10) {
                                        alert("Solo puedes subir un máximo de 10 imágenes.");
                                        return;
                                    }

                                    setForm({ ...form, imagenes: files });

                                    const previews = files.map(file => URL.createObjectURL(file));
                                    setImagePreviews(previews);
                                }}
                            />
                            <div className="preview-container">
                                {imagePreviews.map((src, index) => (
                                    <img key={index} src={src} alt={`Preview ${index}`} className="preview-image" />
                                ))}
                            </div>
                        </div>

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