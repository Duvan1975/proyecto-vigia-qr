import { useEffect, useState } from "react";
import { ModalEditarUsuario } from "./ModalEditarUsuario";

export function TablaUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        fetch("http://localhost:8080/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data.content))
            .catch((error) => console.error("Error al cargar usuario:", error));
    };

    useEffect(() => {
        fetch("http://localhost:8080/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data.content))
            .catch((error) => console.error("Error al cargar usuarios:", error));
    }, []);

    const eliminarUsuario = async (id) => {
        console.log("Id a eliminar:", id); //Prueba en consola
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                //Eliminar del estado para actualizar la tabla
                setUsuarios(usuarios.filter(usuarios => usuarios.id !== id));
            }
            else {
                console.error("Error al eliminar el usuario")
            }
        } catch (error) {
            console.error("Error en la petición DELETE", error);
        }
    };

    return (
        <>

            <table className="table table-striped table-hover" id="tabla">
                <thead>
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Tipo Documento</th>
                        <th>Número Documento</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usu) => (
                        <tr key={usu.id}>
                            <td>{usu.nombres}</td>
                            <td>{usu.apellidos}</td>
                            <td>{usu.tipoDocumento}</td>
                            <td>{usu.numeroDocumento}</td>
                            <td>{usu.username}</td>
                            <td>{usu.rol}</td>
                            <td>{usu.estado}</td>
                            <td>
                                <button onClick={() => {
                                    setUsuarioSeleccionado(usu);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                                <button onClick={() => eliminarUsuario(usu.id)}
                                    className="btn btn-danger"
                                >Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <ModalEditarUsuario
                usuario={usuarioSeleccionado}
                visible={mostrarModal} //Controla si el modal debe mostrarse (true) o no (false).
                onClose={() => setMostrarModal(false)} //Función que se ejecuta cuando el usuario cierra el modal.
                onActualizado={(usuarioActualizado) => {
                    setUsuarios(usuarios.map(e => e.id === usuarioActualizado.id ? usuarioActualizado : e));
                }}
            />
        </>
    )
}