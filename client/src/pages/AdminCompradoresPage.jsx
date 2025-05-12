import React, { useEffect, useState, useContext } from "react";
import { getPropiedades } from "../services/propiedadService";
import { getEvaluacionesPorPropiedad } from "../services/evaluacionService";
import { AuthContext } from "../context/AuthContext";

const AdminCompradoresPage = () => {
    const { user } = useContext(AuthContext);
    const [propiedades, setPropiedades] = useState([]);
    const [compradoresVisibles, setCompradoresVisibles] = useState({});
    const [evaluacionesPorPropiedad, setEvaluacionesPorPropiedad] = useState({});

    useEffect(() => {
        const cargarPropiedades = async () => {
            try {
                const res = await getPropiedades();
                setPropiedades(res.data);
            } catch (err) {
                console.error("Error al cargar propiedades:", err);
            }
        };
        cargarPropiedades();
    }, []);

    const toggleCompradores = async (propiedadId) => {
        setCompradoresVisibles((prev) => ({
            ...prev,
            [propiedadId]: !prev[propiedadId],
        }));

        if (!evaluacionesPorPropiedad[propiedadId]) {
            try {
                const res = await getEvaluacionesPorPropiedad(propiedadId);

                // 🔍 Log de los compradores ordenados
                console.log(`🧾 Evaluaciones para propiedad ${propiedadId}:`);

                console.log("✅ Contado ordenado:");
                res.data.contado.forEach((c, i) => {
                    console.log(
                        `#${i + 1} ${c.cliente.name} | ${c.cliente.email} | 📞 ${c.cliente.phone || "Sin teléfono"} | 🧠 Score: ${c.nivelPotencial} | 📊 ${c.porcentaje?.toFixed(2)}%`
                    );
                });

                console.log("✅ Crédito ordenado:");
                res.data.credito.forEach((c, i) => {
                    console.log(
                        `#${i + 1} ${c.cliente.name} | ${c.cliente.email} | 📞 ${c.cliente.phone || "Sin teléfono"} | 🧠 Score: ${c.nivelPotencial} | 📊 ${c.porcentaje?.toFixed(2)}%`
                    );
                });

                setEvaluacionesPorPropiedad((prev) => ({
                    ...prev,
                    [propiedadId]: res.data,
                }));
            } catch (err) {
                console.error("❌ Error al obtener compradores:", err);
            }
        }
    };

    if (!user || (user.role !== "admin" && user.role !== "vendedor")) {
        return <p>No tienes acceso a esta sección.</p>;
    }

    return (
        <div className="admin-compradores-container">
            <h2>Propiedades y Compradores</h2>

            {propiedades.map((prop) => (
                <div key={prop._id} className="propiedad-card">
                    <h3>{prop.titulo}</h3>
                    <p><strong>Ubicación:</strong> {prop.ubicacion}</p>
                    <p><strong>Precio:</strong> ${prop.precio}</p>
                    <button onClick={() => toggleCompradores(prop._id)}>
                        {compradoresVisibles[prop._id] ? "Ocultar Compradores" : "Ver Compradores"}
                    </button>

                    {compradoresVisibles[prop._id] && evaluacionesPorPropiedad[prop._id] && (
                        <div className="tabla-compradores">
                            <h4>Compradores de Contado</h4>
                            <table>
                                <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Porcentaje de Compra</th>
                                </tr>
                                </thead>
                                <tbody>
                                {evaluacionesPorPropiedad[prop._id].contado.map((c) => (
                                    <tr key={c._id}>
                                        <td>{c.cliente.name}</td>
                                        <td>{c.cliente.email}</td>
                                        <td>{c.cliente.phone}</td>

                                        <td>{c.porcentaje?.toFixed(2)}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <h4>Compradores con Crédito</h4>
                            <table>
                                <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Porcentaje de Compra</th>
                                </tr>
                                </thead>
                                <tbody>
                                {evaluacionesPorPropiedad[prop._id].credito.map((c) => (
                                    <tr key={c._id}>
                                        <td>{c.cliente.name}</td>
                                        <td>{c.cliente.email}</td>
                                        <td>{c.cliente.phone}</td>
                                        <td>{c.porcentaje?.toFixed(2)}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminCompradoresPage;
