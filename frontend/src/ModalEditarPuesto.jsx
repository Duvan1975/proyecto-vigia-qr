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
        fetch(`http://localhost:8080/codigos-qr/${idCodigoQr}/descargar`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("No se pudo descargar el código QR");
                }
                return res.blob(); // 👈 CLAVE
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `codigo_qr_${idCodigoQr}.png`; // nombre del archivo
                document.body.appendChild(a);
                a.click();

                a.remove();
                window.URL.revokeObjectURL(url);
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
            <div className="modal-dialog">
                <div className="modal-content p-4">
                    <h4>Editar Puesto</h4>
                    <input type="text"
                        name="nombrePuesto"
                        value={formulario.nombrePuesto}
                        onChange={handleChange}
                        placeholder="Nombre del Puesto"
                        className="form-control mb-2"
                    />
                    <input type="text"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Descripción"
                    />
                    <input type="text"
                        name="direccion"
                        value={formulario.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                    />
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
                            <table className="table table-bordered">
                                <thead>
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
                                        <tr key={idx}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
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
                                                    className="form-control"
                                                    placeholder="Ubicación"
                                                    value={nuevo.ubicacion}
                                                    onChange={(e) => {
                                                        const copia = [...nuevosCodigosQr];
                                                        copia[idx].ubicacion = e.target.value;
                                                        setNuevosCodigosQr(copia);
                                                    }}
                                                />
                                            </td>

                                            <td>
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
                                            </td>
                                            <td className="text-center">
                                                {previewQr[nuevo.id] ? (
                                                    <img
                                                        src={previewQr[nuevo.id]}
                                                        alt="QR Preview"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            border: "1px solid #ccc",
                                                            padding: "4px",
                                                            borderRadius: "6px"
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-muted">Sin preview</span>
                                                )}

                                            </td>

                                            <td>
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
                                        <tr key={c.id || idx}>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={c.descripcion !== undefined && c.descripcion !== null ? c.descripcion : ""}
                                                    onChange={(e) => handleCodigoQrChange(idx, "descripcion", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={c.ubicacion !== undefined && c.ubicacion !== null ? c.ubicacion : ""}
                                                    onChange={(e) => handleCodigoQrChange(idx, "ubicacion", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={!!c.estado}
                                                    onChange={(e) => handleCodigoQrChange(idx, "estado", e.target.checked)}
                                                />
                                            </td>

                                            <td className="text-center">
                                                {previewQr[c.id] ? (
                                                    <img
                                                        src={previewQr[c.id]}
                                                        alt="QR Preview"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            border: "1px solid #ccc",
                                                            padding: "4px",
                                                            borderRadius: "6px",
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
                                                        Generar imagen QR
                                                    </button>
                                                )}
                                            </td>


                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => actualizarCodigoQr(c)}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="btn btn-success btn-sm ms-2"
                                                    disabled={!c.id || !c.estado}
                                                    onClick={() => descargarCodigoQr(c.id)}
                                                >
                                                    Descargar QR
                                                </button>


                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
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
                            className="btn btn-warning me-2"
                        >
                            Actualizar
                        </button>
                        <button
                            onClick={(codigoQr) => {
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
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};