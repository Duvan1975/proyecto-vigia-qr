import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";

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

    const limpiarBusqueda = () => {
        setResultadoBusqueda([]);
        setFechaBuscar("");
        setNombreBuscar("");
        setUsuarioBuscar("");
        setEnBusqueda(false);
        setPaginaActual(0);
        cargarRondas(0);
    };

    const manejarCambioPagina = (nuevaPagina) => {
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
    };

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

    // Datos a mostrar (búsqueda o todos)
    const datosAMostrar = enBusqueda ? resultadoBusqueda : rondasPuesto;

    return (
        <div className="container-fluid">
            {/* Sección de búsqueda */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Buscar Rondas</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Tipo de búsqueda</label>
                            <select 
                                className="form-select"
                                value={tipoBusqueda}
                                onChange={(e) => {
                                    setTipoBusqueda(e.target.value);
                                    setResultadoBusqueda([]);
                                    setEnBusqueda(false);
                                }}
                            >
                                <option value="nombreDelPuesto">Por Nombre del Puesto</option>
                                <option value="fecha">Por Fecha</option>
                                <option value="usuario">Por Nombre del Usuario</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">
                                {tipoBusqueda === "nombreDelPuesto"
                                    ? "Nombre del Puesto"
                                    : tipoBusqueda === "fecha"
                                    ? "Fecha (AAAA-MM-DD)"
                                    : "Nombre del Usuario"}
                            </label>
                            <input
                                type={tipoBusqueda === "fecha" ? "date" : "text"}
                                className="form-control"
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
                                placeholder={
                                    tipoBusqueda === "nombreDelPuesto"
                                        ? "Ej: INDUSTRIA LA LICORERA"
                                        : tipoBusqueda === "fecha"
                                        ? "YYYY-MM-DD"
                                        : "Ej: RUBEN DARIO GOMEZ ARIAS"
                                }
                            />
                        </div>
                        
                        <div className="col-md-3 d-flex align-items-end">
                            <div className="d-flex gap-2 w-100">
                                <button 
                                    onClick={manejarBusqueda}
                                    className="btn btn-primary flex-grow-1"
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
                                
                                {(enBusqueda || nombreBuscar || fechaBuscar || usuarioBuscar) && (
                                    <button
                                        onClick={limpiarBusqueda}
                                        className="btn btn-secondary"
                                        disabled={cargando}
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de resultados */}
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
            )}

            {/* Paginación */}
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
            )}

            {/* Tabla de resultados */}
            <div className="card">
                <div className="card-body">
                    {datosAMostrar.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-clock-history fs-1 text-muted mb-3"></i>
                            <h5>No hay rondas para mostrar</h5>
                            <p className="text-muted">
                                {enBusqueda 
                                    ? "No se encontraron resultados para tu búsqueda." 
                                    : "No hay rondas registradas aún."}
                            </p>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
}