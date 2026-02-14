import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";
import { exportarAExcel } from "./utils/exportarExcel";

export function TablaRondas() {
    const [rondasPuesto, setRondasPuesto] = useState([]);

    // Estados para controlar la paginación
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(20);
    const [cargando, setCargando] = useState(true);

    // Estados de búsqueda
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [fechaBuscar, setFechaBuscar] = useState("");
    const [usuarioBuscar, setUsuarioBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState([]);
    const [tipoBusqueda, setTipoBusqueda] = useState("nombreDelPuesto");
    const [enBusqueda, setEnBusqueda] = useState(false);

    // Cargar rondas iniciales
    useEffect(() => {
        cargarRondas(paginaActual);
    }, [paginaActual]);

    const cargarRondas = (pagina = 0) => {
        setCargando(true);
        authFetch(`http://localhost:8080/rondas?page=${pagina}&sort=fecha,desc`)
            .then((response) => response.json())
            .then((data) => {
                setRondasPuesto(data.content || []);
                setTotalPaginas(data.totalPages || 0);
                setPaginaActual(data.number || 0);
                setTotalElementos(data.totalElements || 0);
                setTamanoPagina(data.size || 20);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar rondas:", error);
                setCargando(false);
            });
    };

    const manejarBusqueda = () => {
        if (tipoBusqueda === "nombreDelPuesto") {
            buscarRondaPorNombrePuesto();
        } else if (tipoBusqueda === "fecha") {
            buscarRondaPorFecha();
        } else if (tipoBusqueda === "usuario") {
            buscarRondaPorUsuario();
        }
    };

    const buscarRondaPorNombrePuesto = () => {
        if (!nombreBuscar || nombreBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Por favor ingrese un nombre válido.",
            });
            return;
        }

        setCargando(true);
        setEnBusqueda(true);

        authFetch(`http://localhost:8080/rondas/puesto/nombre?nombre=${encodeURIComponent(nombreBuscar)}&page=0&sort=fecha,desc`)
            .then((res) => {
                if (!res.ok) throw new Error("Puesto no encontrado");
                return res.json();
            })
            .then((data) => {
                setResultadoBusqueda(data.content || []);
                setTotalPaginas(data.totalPages || 1);
                setPaginaActual(data.number || 0);
                setTotalElementos(data.totalElements || 0);

                Swal.fire({
                    icon: "success",
                    title: "Rondas Encontradas",
                    text: `${data.totalElements || data.content.length} coincidencias encontradas`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontraron rondas para ese puesto.",
                });
                setResultadoBusqueda([]);
                setCargando(false);
            });
    };

    const buscarRondaPorFecha = () => {
        if (!fechaBuscar || fechaBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Fecha requerida",
                text: "Por favor ingrese la fecha.",
            });
            return;
        }

        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fechaBuscar)) {
            Swal.fire({
                icon: "error",
                title: "Formato inválido",
                text: "La fecha debe estar en formato AAAA-MM-DD (ej: 2026-02-08)",
            });
            return;
        }

        setCargando(true);
        setEnBusqueda(true);

        authFetch(`http://localhost:8080/rondas/fecha/${fechaBuscar}?page=0&sort=fecha,desc`)
            .then((res) => {
                if (!res.ok) throw new Error("Fecha no encontrada o sin registros");
                return res.json();
            })
            .then((data) => {
                setResultadoBusqueda(data.content || []);
                setTotalPaginas(data.totalPages || 1);
                setPaginaActual(data.number || 0);
                setTotalElementos(data.totalElements || 0);

                Swal.fire({
                    icon: "success",
                    title: "Rondas Encontradas",
                    text: `${data.totalElements || data.content.length} rondas encontradas para ${fechaBuscar}`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontraron registros con la fecha buscada.",
                });
                setResultadoBusqueda([]);
                setCargando(false);
            });
    };

    const buscarRondaPorUsuario = () => {
        if (!usuarioBuscar || usuarioBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Por favor ingrese un nombre de usuario válido.",
            });
            return;
        }

        setCargando(true);
        setEnBusqueda(true);

        authFetch(`http://localhost:8080/rondas/usuario/nombre?nombre=${encodeURIComponent(usuarioBuscar)}&page=0&sort=fecha,desc`)
            .then((res) => {
                if (!res.ok) throw new Error("Usuario no encontrado");
                return res.json();
            })
            .then((data) => {
                setResultadoBusqueda(data.content || []);
                setTotalPaginas(data.totalPages || 1);
                setPaginaActual(data.number || 0);
                setTotalElementos(data.totalElements || 0);

                Swal.fire({
                    icon: "success",
                    title: "Rondas Encontradas",
                    text: `${data.totalElements || data.content.length} rondas encontradas para el usuario`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontraron rondas para ese usuario.",
                });
                setResultadoBusqueda([]);
                setCargando(false);
            });
    };

    /*const limpiarBusqueda = () => {
        setResultadoBusqueda([]);
        setFechaBuscar("");
        setNombreBuscar("");
        setUsuarioBuscar("");
        setEnBusqueda(false);
        setPaginaActual(0);
        cargarRondas(0);
    };*/

    /*const manejarCambioPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);

        if (enBusqueda) {
            // Si estamos en búsqueda, cargar la página correspondiente
            let url = "";

            if (tipoBusqueda === "nombreDelPuesto" && nombreBuscar) {
                url = `http://localhost:8080/rondas/puesto/nombre?nombre=${encodeURIComponent(nombreBuscar)}&page=${nuevaPagina}&sort=fecha,desc`;
            } else if (tipoBusqueda === "fecha" && fechaBuscar) {
                url = `http://localhost:8080/rondas/fecha/${fechaBuscar}?page=${nuevaPagina}&sort=fecha,desc`;
            } else if (tipoBusqueda === "usuario" && usuarioBuscar) {
                url = `http://localhost:8080/rondas/usuario/nombre?nombre=${encodeURIComponent(usuarioBuscar)}&page=${nuevaPagina}&sort=fecha,desc`;
            }

            if (url) {
                authFetch(url)
                    .then(res => res.json())
                    .then(data => {
                        setResultadoBusqueda(data.content || []);
                        setTotalPaginas(data.totalPages || 1);
                        setTotalElementos(data.totalElements || 0);
                    })
                    .catch(error => {
                        console.error("Error al cambiar página:", error);
                        Swal.fire("Error", "No se pudo cargar la página", "error");
                    });
            }
        } else {
            // Si no estamos en búsqueda, cargar todas las rondas
            cargarRondas(nuevaPagina);
        }
    };*/

    if (cargando && paginaActual === 0) {
        return (
            <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando listado de rondas...</p>
            </div>
        );
    }

    /*const exportarExcel = () => {
        const datosExportar = rondasPuesto.map(ronda => ({
            "Usuario": ronda.usuario,
            "Nombre del Puesto": ronda.puestoTrabajo || "—",
            "Ubicación": ronda.ubicacionQr || "—",
            "Fecha": ronda.fecha || "—",
            "Hora": ronda.hora,
            "Observaciones": ronda.observaciones || "—"
        }));

        // Nombre del archivo
        const nombreArchivo = `Rondas_${nombreBuscar.replace(/\s+/g, '_')}`;

        // Llama a la función de exportación
        exportarAExcel(datosExportar, nombreArchivo);
        // Función auxiliar para formatear fechas

    };

    const exportarTodasLasRondas = () => {
        Swal.fire({
            title: "Exportando...",
            text: "Preparando archivo Excel con todas las rondas",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        authFetch("http://localhost:8080/rondas/exportar")
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
                        text: "No hay rondas para exportar",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }

                // Exportar TODOS los usuarios
                exportarAExcel(data, `todas_las_rondas_${new Date().toISOString().slice(0, 10)}`);

                Swal.fire({
                    icon: "success",
                    title: "¡Exportación completada!",
                    html: `
                            <p><strong>${data.length} rondas</strong> exportadas correctamente</p>
                            <p class="text-muted small mt-2">
                                <i class="bi bi-file-excel me-1"></i>
                                Archivo: todas_las_puestas_${new Date().toISOString().slice(0, 10)}.xlsx
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
                    text: "No se pudieron obtener las rondas realizadas. Intenta nuevamente.",
                    confirmButtonText: "Entendido"
                });
            });
    };*/

    const exportarRondas = () => {
        // Determinar qué filtro está activo
        let url = "http://localhost:8080/rondas/exportar?";
        const params = [];

        if (tipoBusqueda === "nombreDelPuesto" && nombreBuscar.trim() !== "") {
            params.push(`nombrePuesto=${encodeURIComponent(nombreBuscar)}`);
        } else if (tipoBusqueda === "usuario" && usuarioBuscar.trim() !== "") {
            params.push(`nombreUsuario=${encodeURIComponent(usuarioBuscar)}`);
        } else if (tipoBusqueda === "fecha" && fechaBuscar.trim() !== "") {
            params.push(`fecha=${encodeURIComponent(fechaBuscar)}`);
        }

        // Si hay filtros, los agregamos; si no, exportamos todo
        url = params.length > 0 ? url + params.join('&') : "http://localhost:8080/rondas/exportar";

        Swal.fire({
            title: "Exportando...",
            text: params.length > 0 ? "Exportando rondas filtradas" : "Exportando todas las rondas",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        authFetch(url)
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
                        text: "No hay rondas para exportar con los filtros seleccionados",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }

                // Formatear datos para Excel
                const datosExportar = data.map(ronda => ({
                    "Fecha": ronda.fecha,
                    "Hora": ronda.hora,
                    "Usuario": ronda.usuario,
                    "Puesto de Trabajo": ronda.puestoTrabajo,
                    "Ubicación QR": ronda.ubicacionQr,
                    "Observaciones": ronda.observaciones || "Sin observaciones"
                }));

                // Nombre del archivo según filtro
                let nombreArchivo = "todas_las_rondas";
                if (params.length > 0) {
                    if (tipoBusqueda === "nombreDelPuesto") nombreArchivo = `rondas_puesto_${nombreBuscar.replace(/\s+/g, '_')}`;
                    else if (tipoBusqueda === "usuario") nombreArchivo = `rondas_usuario_${usuarioBuscar.replace(/\s+/g, '_')}`;
                    else if (tipoBusqueda === "fecha") nombreArchivo = `rondas_fecha_${fechaBuscar}`;
                }

                exportarAExcel(datosExportar, nombreArchivo + `_${new Date().toISOString().slice(0, 10)}`);

                Swal.fire({
                    icon: "success",
                    title: "¡Exportación completada!",
                    text: `${data.length} rondas exportadas correctamente`,
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al exportar",
                    text: "No se pudieron obtener las rondas. Intenta nuevamente."
                });
            });
    };

    if (cargando) return <p>Cargando historial...</p>;

    // Datos a mostrar (búsqueda o todos)
    const datosAMostrar = enBusqueda ? resultadoBusqueda : rondasPuesto;

    return (
        <>
            {/* Sección de búsqueda */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="mb-4">
                            <h5>Buscar Rondas por:</h5>
                            <div className="row">
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        aria-label="Tipo de búsqueda"
                                        onChange={(e) => {
                                            setTipoBusqueda(e.target.value);
                                            setResultadoBusqueda([]);
                                            setEnBusqueda(false);
                                        }}
                                        value={tipoBusqueda}
                                    >
                                        <option value="nombreDelPuesto">Por Nombre del Puesto</option>
                                        <option value="fecha">Por Fecha</option>
                                        <option value="usuario">Por Nombre del Usuario</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type={tipoBusqueda === "fecha" ? "date" : "text"}
                                        value={
                                            tipoBusqueda === "nombreDelPuesto" ? nombreBuscar :
                                                tipoBusqueda === "fecha" ? fechaBuscar :
                                                    usuarioBuscar
                                        }
                                        onChange={(e) => {
                                            if (tipoBusqueda === "nombreDelPuesto") {
                                                setNombreBuscar(e.target.value);
                                            } else if (tipoBusqueda === "fecha") {
                                                setFechaBuscar(e.target.value);
                                            } else {
                                                setUsuarioBuscar(e.target.value);
                                            }
                                        }}
                                        placeholder={`Ingrese ${tipoBusqueda === "nombreDelPuesto" ? "nombre del puesto" :
                                            tipoBusqueda === "fecha" ? "fecha (AAAA-MM-DD)" :
                                                "nombre del usuario"}`}
                                        className="form-control mb-2"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={manejarBusqueda}
                                className="btn btn-info me-2"
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Buscando...
                                    </>
                                ) : (
                                    "Buscar"
                                )}
                            </button>

                            {resultadoBusqueda && (
                                <button
                                    onClick={() => {
                                        setResultadoBusqueda([]);
                                        setFechaBuscar("");
                                        setNombreBuscar("");
                                        setUsuarioBuscar("");
                                        setEnBusqueda("");
                                        setPaginaActual(0);
                                        cargarRondas(0);
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Limpiar Búsqueda
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                />
            )}
            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <div className="mt-2 text-center">
                    <small>
                        Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                        {tamanoPagina} por página, total de registros: {totalElementos}
                    </small>
                </div>
            )}

            <div>
                <button
                    className="btn btn-success me-2"
                    onClick={exportarRondas}
                    title="Exportar a Excel"
                >
                    <i className="bi bi-file-excel"></i> Exportar
                </button>
            </div>
            {/*
            <div>
                <button
                    onClick={exportarTodasLasRondas}
                    className="btn btn-success"
                    title="Exportar todas las rondas registradas"
                >
                    <i className="bi bi-file-excel me-1"></i>
                    Exportar Todo
                </button>
            </div>
            */}
            {/* Información de resultados
            {enBusqueda && resultadoBusqueda.length > 0 && (
                <div className="alert alert-info mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Resultados de búsqueda:</strong>
                            {tipoBusqueda === "nombreDelPuesto"
                                ? ` Puesto: "${nombreBuscar}"`
                                : tipoBusqueda === "fecha"
                                    ? ` Fecha: ${fechaBuscar}`
                                    : ` Usuario: "${usuarioBuscar}"`}
                            <span className="ms-2 badge bg-primary">
                                {totalElementos} rondas encontradas
                            </span>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => window.print()}
                        >
                            <i className="bi bi-printer me-1"></i>
                            Imprimir
                        </button>
                    </div>
                </div>
            )}  */}

            {/* Paginación 
            {totalPaginas > 1 && (
                <div className="mb-3">
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onChange={manejarCambioPagina}
                    />
                    <div className="text-center mt-2">
                        <small className="text-muted">
                            Página {paginaActual + 1} de {totalPaginas} •
                            Mostrando {datosAMostrar.length} de {totalElementos} rondas
                        </small>
                    </div>
                </div>
            )} */}

            {/* Tabla de resultados */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Puesto</th>
                                    <th>Ubicación</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Observaciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosAMostrar.map((ronda) => (
                                    <tr key={ronda.id}>
                                        <td>
                                            <span className="badge bg-info text-dark">
                                                {ronda.usuario}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>{ronda.puestoTrabajo}</strong>
                                        </td>
                                        <td>{ronda.ubicacionQr}</td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                {ronda.fecha}
                                            </span>
                                        </td>
                                        <td>
                                            <small className="text-muted">{ronda.hora}</small>
                                        </td>
                                        <td>
                                            {ronda.observaciones ? (
                                                <div className="fst-italic">
                                                    "{ronda.observaciones}"
                                                </div>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Detalles de Ronda',
                                                        html: `
                                                                <div class="text-start">
                                                                    <p><strong>ID:</strong> ${ronda.id}</p>
                                                                    <p><strong>Fecha:</strong> ${ronda.fecha}</p>
                                                                    <p><strong>Hora:</strong> ${ronda.hora}</p>
                                                                    <p><strong>Usuario:</strong> ${ronda.usuario}</p>
                                                                    <p><strong>Puesto:</strong> ${ronda.puestoTrabajo}</p>
                                                                    <p><strong>Ubicación QR:</strong> ${ronda.ubicacionQr}</p>
                                                                    <p><strong>Observaciones:</strong> ${ronda.observaciones || 'Ninguna'}</p>
                                                                </div>
                                                            `,
                                                        icon: 'info'
                                                    });
                                                }}
                                                title="Ver detalles"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}