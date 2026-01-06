import { useEffect, useState } from "react";

export function Tabla() {

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/usuarios")
        .then((response) => response.json())
        .then((data) => setUsuarios(data.content))
        .catch((error) => console.error("Error al cargar usuarios:", error));
    }, []);

    return (
        <table className="table table-striped table-hover" id="tabla">
            <thead>
                <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Tipo Documento</th>
                    <th>Número Documento</th>
                    <th>Usuario</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((usu,index) => (
                    <tr key={index}>
                        <td>{usu.nombres}</td>
                        <td>{usu.apellidos}</td>
                        <td>{usu.tipoDocumento}</td>
                        <td>{usu.numeroDocumento}</td>
                        <td>{usu.username}</td>
                        <td>{usu.password}</td>
                        <td>{usu.rol}</td>
                        <td>{usu.estado}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
    )
}