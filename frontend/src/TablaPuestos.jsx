import { useEffect, useState } from "react";
import { ModalEditarPuesto } from "./ModalEditarPuesto";
import Swal from "sweetalert2";

export function TablaPuestos() {

    const [puestosTrabajos, setPuestosTrabajos] = useState([]);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estados de búsqueda
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

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

    const cambiarEstadoPuesto = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/puestosTrabajos/${id}/estado`, {
                method: "PATCH",
            });

            if (response.ok) {

                // Actualizar lista principal
                setPuestosTrabajos(prev =>
                    prev.map(p =>
                        p.id === id ? { ...p, estado: !p.estado } : p
                    )
                );

                // 🔥 Actualizar resultado de búsqueda si es el mismo puesto
                setResultadoBusqueda(prev =>
                    prev && prev.id === id
                        ? { ...prev, estado: !prev.estado }
                        : prev
                );

            } else {
                console.error("Error al cambiar estado");
            }
        } catch (error) {
            console.error("Error en la petición PATCH", error);
        }
    };

    const buscarPuestoPorNombre = () => {
        if (!nombreBuscar || nombreBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Por favor ingrese un nombre válido.",
            });
            return;
        }

        fetch(`http://localhost:8080/puestosTrabajos/buscarPorNombrePuesto?nombrePuesto=${nombreBuscar}`)
            .then((res) => {
                if (!res.ok) throw new Error("Puesto no encontrado");
                return res.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    resultadoBusqueda(null);
                } else {
                    setResultadoBusqueda(data[0]); // Tratamos data como un array y tomamos la primera persona
                }
                // Mensaje de éxito muestra nombre y direccion del puesto
                Swal.fire({
                    icon: "success",
                    title: "Puesto Encontrado",
                    text: `Nombre: ${data[0].nombrePuesto} ${data[0].direccion}`,
                    timer: 3000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);
                // Mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontró el puesto con ese nombre.",
                });
                setResultadoBusqueda(null);
            })
    }

    return (
        <>
            <div className="mb-4">
                <h5>Buscar Puesto por Nombre</h5>
                <input
                    type="text"
                    value={nombreBuscar}
                    onChange={(e) => setNombreBuscar(e.target.value)}
                    placeholder="Ingrese el nombre"
                    className="form-control mb-2"
                />
                <button onClick={buscarPuestoPorNombre} className="btn btn-info">Buscar</button>
                {resultadoBusqueda && (
                    <button
                        onClick={() => {
                            setResultadoBusqueda(null);
                            setNombreBuscar("");
                        }}
                        className="btn btn-secondary"
                    >
                        Limpiar Búsqueda
                    </button>
                )}
            </div>

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
                    {resultadoBusqueda ? (
                        <tr style={{ backgroundColor: "red" }}>
                            <td>{resultadoBusqueda.nombrePuesto}</td>
                            <td>{resultadoBusqueda.descripcion}</td>
                            <td>{resultadoBusqueda.direccion}</td>
                            <td>
                                <button
                                    className={`btn btn-sm ${resultadoBusqueda.estado ? "btn-success" : "btn-secondary"}`}
                                    onClick={() => {
                                        Swal.fire({
                                            title: '¿Estás seguro?',
                                            text: `¿Deseas ${resultadoBusqueda.estado ? "desactivar" : "activar"} este puesto?`,
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Sí, cambiar estado',
                                            cancelButtonText: 'Cancelar'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Si el usuario confirma, ejecutar la función original
                                                cambiarEstadoPuesto(resultadoBusqueda.id);
                                            }
                                        });
                                    }}
                                >
                                    {resultadoBusqueda.estado ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                            <td>
                                <button onClick={() => {
                                    setPuestoSeleccionado(resultadoBusqueda);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                            </td>
                        </tr>
                    ) : (
                        puestosTrabajos.map((pues) => (
                            <tr key={pues.id}>
                                <td>{pues.nombrePuesto}</td>
                                <td>{pues.descripcion}</td>
                                <td>{pues.direccion}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${pues.estado ? "btn-success" : "btn-secondary"}`}
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Confirmar cambio de estado',
                                                text: `¿Estás seguro de ${pues.estado ? "desactivar" : "activar"} este puesto?`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, cambiar',
                                                cancelButtonText: 'Cancelar',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    cambiarEstadoPuesto(pues.id);
                                                }
                                            });
                                        }}
                                    >
                                        {pues.estado ? "Activo" : "Inactivo"}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        setPuestoSeleccionado(pues);
                                        setMostrarModal(true);
                                    }}
                                        className="btn btn-sm btn-primary me-2"
                                    >Editar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <ModalEditarPuesto
                puestoTrabajo={puestoSeleccionado}
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onActualizado={(puestoActualizado) => {

                    // Actualiza la tabla principal
                    setPuestosTrabajos(prev =>
                        prev.map(p =>
                            p.id === puestoActualizado.id ? puestoActualizado : p
                        )
                    );

                    // 🔥 Actualiza el resultado buscado si coincide
                    setResultadoBusqueda(prev =>
                        prev && prev.id === puestoActualizado.id
                            ? puestoActualizado
                            : prev
                    );
                }}
            />
        </>
    )
}