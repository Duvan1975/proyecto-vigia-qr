import { useEffect, useState } from "react";
import { CuadrosTexto } from "./CuadrosTexto";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";

const API = process.env.REACT_APP_API_URL;

export function ModalEditarPuesto({ puestoTrabajo, visible, onClose, onActualizado, onEliminado }) {
    const [codigoQr, setCodigoQr] = useState([]);
    //Estado para agregar código qr modificado para que siempre sea visible
    const [nuevosCodigosQr, setNuevosCodigosQr] = useState([
        { descripcion: "", ubicacion: "", estado: true }
    ]);

    //Estado para guardar previews
    /*const [previewQr, setPreviewQr] = useState({});*/

    const [formulario, setFormulario] = useState({
        id: "",
        nombrePuesto: "",
        descripcion: "",
        direccion: "",
        estado: ""
    });
    useEffect(() => {
        if (puestoTrabajo) {
            setFormulario(puestoTrabajo)

            //Obtener código QR del puesto de trabajo por el ID
            authFetch(`${API}/codigos-qr/puesto/${puestoTrabajo.id}`)
                .then(res => res.json())
                .then(data => {
                    const codigosPreparados = (Array.isArray(data) ? data : []).map(c => ({
                        id: c.id ?? c.codigoQrId ?? null,
                        descripcion: c.descripcion ?? "",
                        ubicacion: c.ubicacion ?? "",
                        valorQr: c.valorQr ?? "",
                        fechaCreacion: c.fechaCreacion ?? "",
                        estado: typeof c.estado === "boolean" ? c.estado : true
                    }));
                    setCodigoQr(codigosPreparados);

                });
        }
    }, [puestoTrabajo]);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleCodigoQrChange = (index, field, value) => {
        const nuevosCodigos = [...codigoQr];
        nuevosCodigos[index] = {
            ...nuevosCodigos[index],
            [field]: value
        };
        setCodigoQr(nuevosCodigos);
    };

    const actualizarPuestoTrabajo = () => {
        authFetch(`${API}/puestosTrabajos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then(async (response) => {

                if (!response.ok) {
                    const errorData = await response.json();
                    let mensaje = "Ocurrió un error desconocido";

                    if (Array.isArray(errorData)) {
                        // 🔴 Errores de validación (Bean Validation)
                        mensaje = errorData
                            .map(err => `<strong>${err.campo}</strong>: ${err.error}`)
                            .join("<br>");
                    } else if (errorData.error) {
                        // 🔴 Error de negocio (duplicado, reglas, etc.)
                        mensaje = errorData.error;
                    }

                    throw new Error(mensaje);
                }

                return response.json();
            })
            .then((data) => {
                Swal.fire({
                    icon: "success",
                    title: "Actualización exitosa",
                    text: "El puesto de trabajo fue actualizado correctamente",
                });

                onActualizado(data); // refresca tabla
                onClose();           // cierra modal
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "No se pudo actualizar",
                    html: error.message, // 👈 permite <br> y <strong>
                });
            });
    };


    const actualizarCodigoQr = (codigoQr) => {
        authFetch(`${API}/codigos-qr`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(codigoQr)
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Error al actualizar código");
                }
                return res.json();
            })
            .then(() => {
                Swal.fire(
                    "Código QR actualizado",
                    "Los cambios se guardaron correctamente",
                    "success"
                );
            })
            .catch(err => {
                Swal.fire(
                    "Ubicación duplicada",
                    err.message,
                    "warning"
                );
            });
    };

    //Function para registrar un nuevo código QR
    const registrarNuevoCodigoQr = () => {

        // 🔎 Validar que ninguno venga vacío
        const hayCamposVacios = nuevosCodigosQr.some(
            c => !c.ubicacion || !c.ubicacion.trim()
        );

        if (hayCamposVacios) {
            Swal.fire(
                "Campos incompletos",
                "Todos los códigos deben tener ubicación",
                "warning"
            );
            return;
        }

        authFetch(`${API}/codigos-qr/puesto/${puestoTrabajo.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevosCodigosQr)
        })
            .then(async res => {
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Error al registrar códigos QR");
                }
                return res.json();
            })
            .then((codigosCreados) => {
                console.log("Respuesta del backend (codigosCreados):", codigosCreados);

                // Formatear los datos usando el campo correcto "codigoQrId"
                const codigosFormateados = codigosCreados.map(c => ({
                    id: c.codigoQrId,  // ← USA codigoQrId AQUÍ
                    descripcion: c.descripcion || "",
                    ubicacion: c.ubicacion || "",
                    valorQr: c.valorQr || "",
                    fechaCreacion: c.fechaCreacion || "",
                    estado: typeof c.estado === "boolean" ? c.estado : true
                }));

                console.log("Códigos formateados:", codigosFormateados);

                // Agregar todos a la tabla
                setCodigoQr(prev => [...prev, ...codigosFormateados]);

                // Limpiar formulario
                setNuevosCodigosQr([
                    { descripcion: "", ubicacion: "", estado: true }
                ]);

                Swal.fire(
                    "Códigos QR agregados",
                    "Los códigos fueron registrados correctamente",
                    "success"
                );
            })
            .catch(err => {
                Swal.fire(
                    "Ubicación duplicada",
                    err.message,
                    "warning"
                );
            });
    };


    const descargarCodigoQr = (idCodigoQr) => {
        // Buscar el código QR en el estado actual
        const codigo = codigoQr.find(c => c.id === idCodigoQr);

        if (!codigo) {
            Swal.fire("Error", "Código QR no encontrado", "error");
            return;
        }

        // Preparar nombres para el archivo
        const nombrePuesto = (formulario.nombrePuesto || "puesto").trim();
        const ubicacion = (codigo.ubicacion || "ubicacion").trim();

        // Función para limpiar texto para nombre de archivo
        const limpiarTexto = (texto) => {
            return texto
                .normalize("NFD")  // Separar acentos
                .replace(/[\u0300-\u036f]/g, "")  // Eliminar diacríticos
                .replace(/[^a-zA-Z0-9\s]/g, '')  // Solo letras, números y espacios
                .replace(/\s+/g, '_')  // Espacios a guiones bajos
                .toLowerCase();
        };

        const nombreArchivo = `${limpiarTexto(nombrePuesto)}_${limpiarTexto(ubicacion)}`;

        authFetch(`${API}/codigos-qr/${idCodigoQr}/descargar`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("No se pudo descargar el código QR");
                }
                return res.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${nombreArchivo}.png`;
                document.body.appendChild(a);
                a.click();

                // Esperar un momento antes de limpiar
                setTimeout(() => {
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }, 100);

                // Mostrar notificación de éxito
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Descargado",
                    text: `${nombrePuesto} - ${ubicacion}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const eliminarCodigoQr = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este código QR será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                authFetch(`${API}/codigos-qr/${id}`, {
                    method: "DELETE",
                    headers: {
                    }
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar código QR");
                        // ✅ Eliminar de la lista local
                        setCodigoQr(codigoQr.filter(c => c.id !== id));
                        Swal.fire("Eliminado", "El código QR fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarPuestoTrabajo = () => {
        authFetch(`${API}/puestosTrabajos/${formulario.id}`, {
            method: "DELETE"
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "No se pudo eliminar el puesto");
                }
            })
            .then(() => {
                Swal.fire(
                    "Puesto eliminado",
                    "El puesto fue eliminado correctamente",
                    "success"
                ).then(() => {
                    onEliminado(formulario.id);
                    onClose();
                });
            })
            .catch((error) => {
                Swal.fire(
                    "No se pudo eliminar",
                    error.message,
                    "warning"
                );
            });
    };


    if (!visible) return null;

    return (
        <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
            <div className="modal-dialog modal-lg"> {/* Agregar modal-lg aquí */}
                <div className="modal-content p-4">
                    <h4 className="modal-title mb-3">Editar Puesto</h4>

                    <div className="row">
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Nombre del Puesto"
                            tipoinput="text"
                            nombreinput="nombrePuesto"
                            idinput="nombrePuestoEditar"
                            placeholderinput="Nombre del Puesto"
                            value={formulario.nombrePuesto}
                            onChange={handleChange}
                        />

                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Descripción"
                            tipoinput="text"
                            nombreinput="descripcion"
                            idinput="descripcionEditar"
                            placeholderinput="Descripción"
                            value={formulario.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="row">
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Dirección"
                            tipoinput="text"
                            nombreinput="direccion"
                            idinput="direccionEditar"
                            placeholderinput="Direccion"
                            value={formulario.direccion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                            <h5 className="mb-0">Códigos QR</h5>
                            <div>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#tablaCodigosQr"
                                    aria-expanded="false"
                                    aria-controls="tablaCodigosQr"
                                >
                                    Mostrar/Ocultar Códigos QR
                                </button>
                            </div>
                        </div>

                        <div className="collapse" id="tablaCodigosQr">
                            <div className="table-responsive"> {/* Agregar para scroll horizontal */}
                                <table className="table table-bordered table-striped">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Descripción</th>
                                            <th>Ubicación</th>
                                            <th>Estado</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nuevosCodigosQr.map((nuevo, idx) => (
                                            <tr key={`nuevo-${idx}`}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Descripción"
                                                        value={nuevo.descripcion}
                                                        onChange={(e) => {
                                                            const copia = [...nuevosCodigosQr];
                                                            copia[idx].descripcion = e.target.value;
                                                            setNuevosCodigosQr(copia);
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Ubicación"
                                                        value={nuevo.ubicacion}
                                                        onChange={(e) => {
                                                            const copia = [...nuevosCodigosQr];
                                                            copia[idx].ubicacion = e.target.value;
                                                            setNuevosCodigosQr(copia);
                                                        }}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-check form-switch d-flex justify-content-center">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={!!nuevo.estado}
                                                            onChange={(e) => {
                                                                const copia = [...nuevosCodigosQr];
                                                                copia[idx].estado = e.target.checked;
                                                                setNuevosCodigosQr(copia);
                                                            }}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={registrarNuevoCodigoQr}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {codigoQr.map((c, idx) => (
                                            <tr key={c.id || `codigo-${idx}`}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={c.descripcion !== undefined && c.descripcion !== null ? c.descripcion : ""}
                                                        onChange={(e) => handleCodigoQrChange(idx, "descripcion", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={c.ubicacion !== undefined && c.ubicacion !== null ? c.ubicacion : ""}
                                                        onChange={(e) => handleCodigoQrChange(idx, "ubicacion", e.target.value)}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-check form-switch d-flex justify-content-center">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={!!c.estado}
                                                            onChange={(e) => handleCodigoQrChange(idx, "estado", e.target.checked)}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => actualizarCodigoQr(c)}
                                                            title="Guardar cambios"
                                                        >
                                                            <i className="bi bi-save-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-success"
                                                            disabled={!c.id || !c.estado}
                                                            onClick={() => descargarCodigoQr(c.id)}
                                                            title="Descargar QR"
                                                        >
                                                            <i className="bi bi-download"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => eliminarCodigoQr(c.id)}
                                                            title="Eliminar"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer mt-3 pt-3 border-top">
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: '¿Eliminar puesto?',
                                    text: 'Esta acción no se puede deshacer',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#6c757d',
                                    confirmButtonText: 'Sí, eliminar',
                                    cancelButtonText: 'Cancelar'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        eliminarPuestoTrabajo();
                                    }
                                });
                            }}
                            className="btn btn-danger me-auto"
                        >
                            <i className="bi bi-trash me-1"></i>
                            Eliminar Puesto
                        </button>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: '¿Actualizar Puesto?',
                                    text: '¿Estás seguro de que deseas guardar los cambios?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Sí, actualizar',
                                    cancelButtonText: 'Cancelar'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        actualizarPuestoTrabajo();
                                    }
                                });
                            }}
                            className="btn btn-warning"
                        >
                            <i className="bi bi-check-circle me-1"></i>
                            Actualizar Puesto
                        </button>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: '¿Cancelar cambios?',
                                    text: 'Los cambios no guardados se perderán',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Sí, cancelar',
                                    cancelButtonText: 'No, continuar'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setFormulario(puestoTrabajo);
                                        // 🧹 LIMPIAR inputs de códigos QR
                                        setNuevosCodigosQr([
                                            { descripcion: "", ubicacion: "", estado: true }
                                        ]);
                                        onClose();
                                    }
                                });
                            }}
                            className="btn btn-secondary"
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};