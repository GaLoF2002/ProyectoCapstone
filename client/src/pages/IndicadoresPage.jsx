import React, { useEffect, useState } from "react";
import { getIndicadores, getIndicadoresPorPropiedad } from "../services/indicadoresService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const IndicadoresPage = () => {
    const [datos, setDatos] = useState(null);
    const [indicadoresPropiedad, setIndicadoresPropiedad] = useState(null);
    const [propiedadActiva, setPropiedadActiva] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getIndicadores();
                setDatos(res.data);
            } catch (err) {
                console.error("Error al cargar indicadores: ", err);
            }
        };
        fetch();
    }, []);

    const manejarVerReporte = async (propiedadId, titulo) => {
        try {
            const res = await getIndicadoresPorPropiedad(propiedadId);
            setIndicadoresPropiedad(res.data);
            setPropiedadActiva(titulo);
        } catch (err) {
            console.error("Error al cargar indicadores de la propiedad: ", err);
        }
    };

    if (!datos) return <p>Cargando indicadores...</p>;

    return (
        <div className="indicadores-container" style={{ padding: "2rem" }}>
            <h2>📊 Indicadores de Gestión - Mes Actual</h2>

            <h3>Tipos de Propiedades Más Vistas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={datos.tiposMasVistos} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100}>
                        {datos.tiposMasVistos.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <h3>Ranking de Propiedades Más Vistas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datos.propiedadesMasVistas.map(p => ({
                    titulo: p.propiedad?.titulo || "Propiedad",
                    total: p.total
                }))}>
                    <XAxis dataKey="titulo" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            <h4>📌 Lista de Propiedades Más Vistas</h4>
            <ul>
                {datos.propiedadesMasVistas.map((p, i) => (
                    <li key={i} style={{ marginBottom: "1rem" }}>
                        <strong>{p.propiedad?.titulo || "Propiedad"}</strong><br />
                        <img src={`http://localhost:5000/${p.propiedad?.imagenes?.[0]}`} alt="Imagen propiedad" style={{ width: "200px", marginBottom: "0.5rem" }} /><br />
                        Tipo: {p.propiedad?.tipo}, Ubicación: {p.propiedad?.ubicacion}, Habitaciones: {p.propiedad?.habitaciones}, Parqueaderos: {p.propiedad?.parqueaderos}<br />
                        Visitas: {p.total}<br />
                        <button onClick={() => manejarVerReporte(p.propiedad?._id, p.propiedad?.titulo)}>📈 Ver Reporte</button>
                    </li>
                ))}
            </ul>

            {indicadoresPropiedad && (
                <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
                    <h3>📈 Reporte de Indicadores para: {propiedadActiva}</h3>
                    <p>
                        <strong>⏱ Tiempo promedio de visualización:</strong>{" "}
                        {Number.isFinite(indicadoresPropiedad.tiempoPromedio)
                            ? Math.round(indicadoresPropiedad.tiempoPromedio)
                            : 0} segundos
                    </p>


                    <h4>👤 Clientes que más la visitaron:</h4>
                    <ul>
                        {indicadoresPropiedad.clientesFrecuentes.map((c, i) => (
                            <li key={i}>{c.cliente.name} – {c.totalVisitas} visitas</li>
                        ))}
                    </ul>

                    <h4>📅 Visitas por Mes:</h4>
                    <ul>
                        {indicadoresPropiedad.visitasMensuales.map((v, i) => (
                            <li key={i}>{v._id.mes}/{v._id.anio}: {v.total} visitas</li>
                        ))}
                    </ul>
                </div>
            )}

            <h3>🔍 Consultas por Filtros Más Comunes</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Habitaciones</th>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Parqueaderos</th>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Consultas</th>
                </tr>
                </thead>
                <tbody>
                {datos.filtrosUsados.map((f, i) => (
                    <tr key={i}>
                        <td>{f._id.habitaciones}</td>
                        <td>{f._id.parqueaderos}</td>
                        <td>{f.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default IndicadoresPage;
