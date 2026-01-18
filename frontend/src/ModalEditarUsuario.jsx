import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function ModalEditarUsuario({ usuario, visible, onClose, onActualizado }) {
    const [formulario, setFormulario] = useState({
        id: "",
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        username: "",
        password: "",
        rol: ""
    });
    useEffect(() => {
        if (usuario) {
            setFormulario(usuario)
        }
    }, [usuario]);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const actualizarUsuario = () => {
        fetch("http://localhost:8080/usuarios", {
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
                        mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join("<br>");
                    } else if (errores.error) {
                        mensaje = errores.error;
                    } else {
                        mensaje = "Ocurrió un error desconocido";
                    }

                    throw new Error(mensaje);
                }

                return response.json();
            })
            .then((data) => {
                onActualizado(data);
                onClose();
                Swal.fire({
                    icon: "success",
                    title: "Actualización exitosa",
                    text: "La persona fue actualizada correctamente."
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error en la actualización",
                    html: error.message
                });
            });
    };

    if (!visible) return null;

    return (
        <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
            <div className="modal-dialog">
                <div className="modal-content p-4">
                    <h4>Editar Usuario</h4>
                    <input type="text"
                        name="nombres"
                        value={formulario.nombres}
                        onChange={handleChange}
                        placeholder="Nombres"
                        className="form-control mb-2"
                    />
                    <input type="text"
                        name="apellidos"
                        value={formulario.apellidos}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Apellidos"
                    />
                    <input type="text"
                        name="tipoDocumento"
                        value={formulario.tipoDocumento}
                        onChange={handleChange}
                        placeholder="Seleccione"
                    />
                    <input type="number"
                        name="numeroDocumento"
                        value={formulario.numeroDocumento}
                        onChange={handleChange}
                        className="form-control mb-2"
                    />
                    <input type="text"
                        name="username"
                        value={formulario.username}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Usuario"
                    />
                    <input type="password"
                        name="password"
                        value={formulario.password}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Contraseña"
                    />
                    <input type="text"
                        name="rol"
                        value={formulario.rol}
                        onChange={handleChange}
                        placeholder="Seleccione"
                    />
                    <div className="mt-3">
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: '¿Actualizar usuario?',
                                    text: '¿Estás seguro de que deseas guardar los cambios?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Sí, actualizar',
                                    cancelButtonText: 'Cancelar'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        actualizarUsuario();
                                    }
                                });
                            }}
                            className="btn btn-warning me-2"
                        >
                            Actualizar
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
                                }).then((usuario) => {
                                    if (usuario) setFormulario(usuario);
                                        onClose();
                                    
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
}