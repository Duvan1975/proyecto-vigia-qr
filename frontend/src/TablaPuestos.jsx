import { useEffect, useState } from "react";
import { ModalEditarPuesto } from "./ModalEditarPuesto";
import Paginacion from "./Paginacion";
import Swal from "sweetalert2";
import { TablaCodigoQrPorPuesto } from "./TablaCodigoQrPorPuesto";
import { authFetch } from "./utils/authFetch";
import { exportarAExcel } from "./utils/exportarExcel";

const API = process.env.REACT_APP_API_URL;

export function TablaPuestos() {

    const [puestosTrabajos, setPuestosTrabajos] = useState([]);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estados de búsqueda
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

    //Estados para controlar la paginación
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [setTamanoPagina] = useState(0);

    //Estados para cargar y controlar el historial de códigos QR
    const [codigoQrPorPuestoListar, setCodigoQrPorPuestoListar] = useState(null);
    const [mostrarTablaCodigoQr, setMostrarTablaCodigoQr] = useState(false);
    const [contadorActualizacion, setContadorActualizacion] = useState(0);

    useEffect(() => {
        cargarPuestos(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarPuestos = (pagina = 0) => {
        authFetch(`${API}/puestosTrabajos?page=${pagina}`)
            .then((response) => response.json())
            .then((data) => {
                setPuestosTrabajos(data.content);
                setTotalPaginas(data.totalPages); //Muestra el total de las páginas
                setPaginaActual(data.number); //Muestra el número actual de la página
                setTotalElementos(data.totalElements); //Trae el número de elementos de la todas las páginas
                setTamanoPagina(data.size); //Muestra la cantidad de elementos por página
            })
            .catch((error) => console.error("Error al cargar puestos de trabajo:", error));
    };

    useEffect(() => {
        authFetch(`${API}/puestosTrabajos`)
            .then((response) => response.json())
            .then((data) => setPuestosTrabajos(data.content))
            .catch((error) => console.error("Error al cargar puestos de trabajo:", error));
    }, []);

    const cambiarEstadoPuesto = async (id) => {
        try {
            const response = await authFetch(`${API}/puestosTrabajos/${id}/estado`, {
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

        authFetch(`${API}/puestosTrabajos/buscarPorNombrePuesto?nombrePuesto=${nombreBuscar}`)
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

    const exportarTodosLosPuestos = () => {
        Swal.fire({
            title: "Exportando...",
            text: "Preparando archivo Excel con todos los puestos",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        authFetch(`<${API}/puestosTrabajos/exportar`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener datos");
                return res.json();
            })
            .then(data => {
                Swal.close();

                if (!data || data.length === 0) {
                    Swal.fire({
                        icon: "info",
                        title: "Sin datos",
                        text: "No hay puestos para exportar",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }

                // Exportar TODOS los usuarios
                exportarAExcel(data, `todos_los_puestos_${new Date().toISOString().slice(0, 10)}`);

                Swal.fire({
                    icon: "success",
                    title: "¡Exportación completada!",
                    html: `
                        <p><strong>${data.length} puestos</strong> exportados correctamente</p>
                        <p class="text-muted small mt-2">
                            <i class="bi bi-file-excel me-1"></i>
                            Archivo: todos_los_puestos_${new Date().toISOString().slice(0, 10)}.xlsx
                        </p>
                    `,
                    timer: 3000,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error("Error en exportación:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al exportar",
                    text: "No se pudieron obtener los puestos de trabajo. Intenta nuevamente.",
                    confirmButtonText: "Entendido"
                });
            });
    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="mb-3">Buscar Puesto</h5>
                    <div className="row g-2 align-items-end">
                        <div className="col-12 col-md-4">
                            <input
                                type="text"
                                value={nombreBuscar}
                                onChange={(e) => {
                                    setNombreBuscar(e.target.value);
                                    if (e.target.value.length >= 4) {
                                        buscarPuestoPorNombre();
                                    }
                                }}
                                placeholder="Ingrese el nombre"
                                className="form-control"
                            />
                        </div>

                        <div className="col-12 col-md-auto d-flex gap-2 flex-wrap">
                            {/*<button
                                onClick={buscarPuestoPorNombre}
                                className="btn btn-info"
                            >
                                Buscar
                            </button>*/}

                            <button
                                onClick={() => {
                                    setResultadoBusqueda(null);
                                    setNombreBuscar("");
                                    cargarPuestos();
                                    setMostrarTablaCodigoQr(false);
                                }}
                                className="btn btn-secondary"
                            >
                                Limpiar
                            </button>

                            <button
                                onClick={exportarTodosLosPuestos}
                                className="btn btn-success"
                                title="Exportar todos los puestos registrados"
                            >
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-1">
                    {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                        <>
                            <Paginacion
                                paginaActual={paginaActual}
                                totalPaginas={totalPaginas}
                                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                            />
                            <div className="mt-1 text-center">
                                <small>
                                    Total de registros: {totalElementos}
                                </small>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover" id="tabla">
                            <thead>
                                <tr>
                                    <th>Puesto</th>
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
                                            <div className="d-flex flex-wrap gap-1">

                                                <button
                                                    onClick={() => {
                                                        setPuestoSeleccionado(resultadoBusqueda);
                                                        setMostrarModal(true);
                                                    }}
                                                    className="btn btn-sm btn-primary flex-fill flex-md-grow-0"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-secondary flex-fill flex-md-grow-0"
                                                    onClick={() => {
                                                        setCodigoQrPorPuestoListar(resultadoBusqueda.id);
                                                        setMostrarTablaCodigoQr(true);
                                                    }}
                                                >
                                                    <i className="bi bi-qr-code"></i>
                                                </button>

                                            </div>
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
                                                <div className="d-flex flex-wrap gap-1">
                                                    <button onClick={() => {
                                                        setPuestoSeleccionado(pues);
                                                        setMostrarModal(true);
                                                    }}
                                                    className="btn btn-sm btn-primary flex-fill flex-md-grow-0"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary flex-fill flex-md-grow-0"
                                                        onClick={() => {
                                                            setCodigoQrPorPuestoListar(pues.id);
                                                            setMostrarTablaCodigoQr(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-qr-code"></i>
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {mostrarTablaCodigoQr && codigoQrPorPuestoListar && (
                <TablaCodigoQrPorPuesto puestoTrabajoId={codigoQrPorPuestoListar}
                    actualizar={contadorActualizacion}
                    onClose={() => setMostrarTablaCodigoQr(false)} />
            )}
            <ModalEditarPuesto
                puestoTrabajo={puestoSeleccionado}
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onEliminado={(id) => {
                    setPuestosTrabajos(prev =>
                        prev.filter(p => p.id !== id));
                }}
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
                    setContadorActualizacion(prev => prev + 1);
                }}
            />
        </>
    )
}