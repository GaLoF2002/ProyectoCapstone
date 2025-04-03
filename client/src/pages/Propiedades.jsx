import React, { useEffect, useState } from "react";
import { getPropiedades } from "../services/propiedadService";
import "./Propiedades.css";

const Propiedades = ({ setActiveSection }) => {
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 3; // Máximo 3 por página

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

    // Calcular el índice de inicio y fin para la paginación
    const indiceInicio = (paginaActual - 1) * propiedadesPorPagina;
    const indiceFin = indiceInicio + propiedadesPorPagina;
    const propiedadesPaginadas = propiedades.slice(indiceInicio, indiceFin);

    // Funciones para cambiar de página
    const paginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const paginaSiguiente = () => {
        if (indiceFin < propiedades.length) setPaginaActual(paginaActual + 1);
    };

    return (
        <div className="propiedades-container">
            {/* Contenedor superior con título y botón */}
            <div className="header-container">
                <h2>Listado de Propiedades</h2>
                <button onClick={() => setActiveSection("crear-propiedad")}>
                    ➕ Añadir Nueva Propiedad
                </button>
            </div>

            {/* Lista de propiedades paginadas */}
            <div className="prop-list">
                {propiedadesPaginadas.map((p) => (
                    <div key={p._id} className="prop-card">
                        <h3>{p.titulo}</h3>
                        <p>{p.ubicacion}</p>
                        <p>Precio: ${p.precio}</p>
                        <p>Estado: {p.estado}</p>
                    </div>
                ))}
            </div>

            {/* Controles de paginación (se muestran solo si hay más de 3 propiedades) */}
            {propiedades.length > propiedadesPorPagina && (
                <div className="paginacion">
                    <button onClick={paginaAnterior} disabled={paginaActual === 1}>
                        ◀ Anterior
                    </button>
                    <span>Página {paginaActual}</span>
                    <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>
                        Siguiente ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Propiedades;
