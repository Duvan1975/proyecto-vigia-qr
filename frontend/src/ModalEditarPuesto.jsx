import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function ModalEditarPuesto({ puestoTrabajo, visible, onClose, onActualizado }) {
    const [codigoQr, setCodigoQr] = useState([]);
    //Estado para agregar código qr modificado para que siempre sea visible
    const [nuevosCodigosQr, setNuevosCodigosQr] = useState([
        { descripcion: "", ubicacion: "", estado: true }
    ]);

    //Estado para guardar previews
    const [previewQr, setPreviewQr] = useState({});

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
            fetch(`http://localhost:8080/codigos-qr/puesto/${puestoTrabajo.id}`)
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

                    //Cargar previews
                    codigosPreparados.forEach(c => {
                        if (c.id && c.estado) {
                            cargarPreviewQr(c.id);
                        }
                    });

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
        fetch("http://localhost:8080/puestosTrabajos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errores = await response.json();
                    let mensaje;

                    if (Array.isArray(errores)) {
                        // Errores múltiples de validación
                        mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join("<br>");
                    } else if (errores.campo && errores.error) {
                        // Error individual con campo (como un enum incorrecto)
                        mensaje = `<strong>${errores.campo}</strong>: ${errores.error}`;
                    } else if (errores.error) {
                        // Error general sin campo
                        mensaje = errores.error;
                    } else {
                        mensaje = "Ocurrió un error desconocido";
                    }

                    throw new Error(mensaje);
                }

                return response.json();
            })
            .then((data) => {
                onActualizado(data); // actualiza la tabla
                onClose(); // cierra el modal
            })
            .catch((error) => {
                console.error("Error en la actualización:", error);
                alert("Hubo un error al actualizar el puesto de trabajo");
            });
    };

    const actualizarCodigoQr = (codigoQr) => {
        fetch("http://localhost:8080/codigos-qr", {
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

        fetch(`http://localhost:8080/codigos-qr/puesto/${puestoTrabajo.id}`, {
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

                // 1️⃣ Agregar todos a la tabla
                setCodigoQr(prev => [...prev, ...codigosFormateados]);

                // 2️⃣ Generar preview para cada uno (ahora con el ID correcto)
                codigosFormateados.forEach(codigo => {
                    if (codigo.id) {
                        console.log("Generando preview para ID:", codigo.id);
                        cargarPreviewQr(codigo.id);
                    }
                });

                // 3️⃣ Limpiar formulario
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

        fetch(`http://localhost:8080/codigos-qr/${idCodigoQr}/descargar`)
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

    const cargarPreviewQr = (idCodigoQr) => {
        fetch(`http://localhost:8080/codigos-qr/${idCodigoQr}/descargar`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar el preview del QR");
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);

                setPreviewQr(prev => ({
                    ...prev,
                    [idCodigoQr]: url
                }));
            })
            .catch(err => {
                console.error("Preview QR:", err);
            });
    };

    if (!visible) return null;

    return (
    <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
        <div className="modal-dialog modal-lg"> {/* Agregar modal-lg aquí */}
            <div className="modal-content p-4">
                <h4 className="modal-title mb-3">Editar Puesto</h4>
                
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Nombre del Puesto</label>
                            <input 
                                type="text"
                                name="nombrePuesto"
                                value={formulario.nombrePuesto}
                                onChange={handleChange}
                                placeholder="Nombre del Puesto"
                                className="form-control"
                            />
                        </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input 
                                type="text"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Descripción"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input 
                        type="text"
                        name="direccion"
                        value={formulario.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                        className="form-control"
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
                                        <th>Vista</th>
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
                                                {previewQr[nuevo.id] ? (
                                                    <img
                                                        src={previewQr[nuevo.id]}
                                                        alt="QR Preview"
                                                        className="img-thumbnail"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-muted small">Sin preview</span>
                                                )}
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
                                                {previewQr[c.id] ? (
                                                    <img
                                                        src={previewQr[c.id]}
                                                        alt="QR Preview"
                                                        className="img-thumbnail"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            cursor: "pointer"
                                                        }}
                                                        title="Clic para regenerar"
                                                        onClick={() => cargarPreviewQr(c.id)}
                                                    />
                                                ) : (
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => cargarPreviewQr(c.id)}
                                                    >
                                                        Generar QR
                                                    </button>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => actualizarCodigoQr(c)}
                                                        title="Guardar cambios"
                                                    >
                                                        <i className="bi bi-save"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-success"
                                                        disabled={!c.id || !c.estado}
                                                        onClick={() => descargarCodigoQr(c.id)}
                                                        title="Descargar QR"
                                                    >
                                                        <i className="bi bi-download"></i>
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