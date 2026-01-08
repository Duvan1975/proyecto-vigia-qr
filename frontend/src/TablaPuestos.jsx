import { useEffect, useState } from "react";

export function TablaPuestos() {

    const [puestosTrabajos, setPuestosTrabajos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/puestosTrabajos")
        .then((response) => response.json())
        .then((data) => setPuestosTrabajos(data.content))
        .catch((error) => console.error("Error al cargar puestos de trabajo:", error));
    }, []);

    return (
        <table className="table table-striped table-hover" id="tabla">
            <thead>
                <tr>
                    <th>Puesto de Trabajo</th>
                    <th>Descripción</th>
                    <th>Dirección</th>
                </tr>
            </thead>
            <tbody>
                {puestosTrabajos.map((pues,index) => (
                    <tr key={index}>
                        <td>{pues.nombrePuesto}</td>
                        <td>{pues.descripcion}</td>
                        <td>{pues.direccion}</td>
                        <td>{pues.estado}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
    )
}