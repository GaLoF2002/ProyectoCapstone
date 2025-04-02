import React, { useEffect, useState } from "react";
import { getPropiedades } from "../services/propiedadService";

const Propiedades = ({ setActiveSection }) => {
    const [propiedades, setPropiedades] = useState([]);

    useEffect(() => {
        const fetchPropiedades = async () => {
            try {
                const res = await getPropiedades();
                setPropiedades(res.data);
            } catch (err) {
                console.error("Error al obtener propiedades:", err);
            }
        };
        fetchPropiedades();
    }, []);

    return (
        <div>
            <h2>Listado de Propiedades</h2>
            <button onClick={() => setActiveSection("crear-propiedad")}>➕ Añadir Nueva Propiedad</button>
            <div className="prop-list">
                {propiedades.map((p) => (
                    <div key={p._id} className="prop-card">
                        <h3>{p.titulo}</h3>
                        <p>{p.ubicacion}</p>
                        <p>Precio: ${p.precio}</p>
                        <p>Estado: {p.estado}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Propiedades;
