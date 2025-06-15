import { useEffect, useState } from "react";
import { getMisIntereses } from "../services/interesService";

const MisIntereses = () => {
    const [intereses, setIntereses] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await getMisIntereses();
            setIntereses(res.data);
        };
        fetch();
    }, []);

    return (
        <div>
            <h2>Propiedades que te interesan</h2>
            {intereses.map((i) => (
                <div key={i._id} className="propiedad-card">
                    <h4>{i.propiedad.titulo}</h4>
                    <p>{i.propiedad.ubicacion}</p>
                    <p>${i.propiedad.precio}</p>
                </div>
            ))}
        </div>
    );
};

export default MisIntereses;
