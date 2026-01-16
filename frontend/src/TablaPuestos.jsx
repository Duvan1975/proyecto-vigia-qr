import { useEffect, useState } from "react";
import { ModalEditarPuesto } from "./ModalEditarPuesto";

export function TablaPuestos() {

    const [puestosTrabajos, setPuestosTrabajos] = useState([]);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarPuestos();
    }, []);

    const cargarPuestos = () => {
        fetch("http://localhost:8080/puestosTrabajos")
            .then((response) => response.json())
            .then((data) => setPuestosTrabajos(data.content))
            .catch((error) => console.error("Error al cargar puestos de trabajo:", error));
    };

    useEffect(() => {
        fetch("http://localhost:8080/puestosTrabajos")
            .then((response) => response.json())
            .then((data) => setPuestosTrabajos(data.content))
            .catch((error) => console.error("Error al cargar puestos de trabajo:", error));
    }, []);

    const eliminarPuesto = async (id) => {
        console.log("Id a eliminar:", id); //Prueba en consola
        try {
            const response = await fetch(`http://localhost:8080/puestosTrabajos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                //Eliminar del estado para actualizar la tabla
                setPuestosTrabajos(puestosTrabajos.filter(puestosTrabajos => puestosTrabajos.id !== id));
            }
            else {
                console.error("Error al eliminar puesto de trabajo")
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
                        <th>Puesto de Trabajo</th>
                        <th>Descripción</th>
                        <th>Dirección</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {puestosTrabajos.map((pues) => (
                        <tr key={pues.id}>
                            <td>{pues.nombrePuesto}</td>
                            <td>{pues.descripcion}</td>
                            <td>{pues.direccion}</td>
                            <td>{pues.estado}</td>
                            <td>
                                <button onClick={() => {
                                    setPuestoSeleccionado(pues);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                                <button onClick={() => eliminarPuesto(pues.id)}
                                    className="btn btn-danger"
                                >Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <ModalEditarPuesto
                puestoTrabajo={puestoSeleccionado}
                visible={mostrarModal} //Controla si el modal debe mostrarse (true) o no (false).
                onClose={() => setMostrarModal(false)} //Función que se ejecuta cuando el usuario cierra el modal.
                onActualizado={(puestoActualizado) => {
                    setPuestosTrabajos(puestosTrabajos.map(e => e.id === puestoActualizado.id ? puestoActualizado : e));
                }}
            />
        </>
    )
}