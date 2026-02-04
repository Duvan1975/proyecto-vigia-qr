import { useEffect, useState } from "react";
import { CuadrosTexto } from "./CuadrosTexto";
import { CuadrosSelect } from "./CuadrosSelect";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";

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
        authFetch("http://localhost:8080/usuarios", {
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
            <div className="modal-dialog modal-lg">
                <div className="modal-content p-4">
                    <h4 className="modal-title mb-3">Editar Usuario</h4>
                    <div className="row">
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Nombres"
                            tipoinput="text"
                            nombreinput="nombres"
                            idinput="nombresEditar"
                            placeholderinput="Nombre del Usuario"
                            value={formulario.nombres}
                            onChange={handleChange}
                        />

                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Apellidos"
                            tipoinput="text"
                            nombreinput="apellidos"
                            idinput="apellidosEditar"
                            placeholderinput="Apellidos"
                            value={formulario.apellidos}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <CuadrosSelect
                            tamanoinput="col-md-6"
                            titulolabel="Tipo Documento:"
                            nombreinput="tipoDocumento"
                            idinput="tipoDocumentoEditar"
                            value={formulario.tipoDocumento}
                            onChange={(e) =>
                                setFormulario({ ...formulario, tipoDocumento: e.target.value })
                            }
                            opciones={[
                                { valor: "CC", texto: "CC" },
                                { valor: "CE", texto: "CE" },
                                { valor: "PASAPORTE", texto: "PASAPORTE" }
                            ]}
                        />
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Número de Documento"
                            tipoinput="number"
                            nombreinput="numeroDocumento"
                            idinput="numeroDocumentoEditar"
                            placeholderinput="Número de Documento"
                            value={formulario.numeroDocumento}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Nombre de Usuario"
                            tipoinput="text"
                            nombreinput="username"
                            idinput="usernameEditar"
                            placeholderinput="Nombre del Usuario"
                            value={formulario.username}
                            onChange={handleChange}
                        />
                        <CuadrosTexto
                            tamanoinput="col-md-6"
                            titulolabel="Nueva contraseña"
                            tipoinput="password"
                            nombreinput="password"
                            idinput="passwordEditar"
                            placeholderinput="Dejar en blanco para no cambiar"
                            value={formulario.password || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <CuadrosSelect
                            tamanoinput="col-md-6"
                            titulolabel="Rol:"
                            nombreinput="rol"
                            idinput="rolEditar"
                            value={formulario.rol}
                            onChange={(e) =>
                                setFormulario({ ...formulario, rol: e.target.value })
                            }
                            opciones={[
                                { valor: "ADMINISTRATIVO", texto: "ADMINISTRATIVO" },
                                { valor: "OPERATIVO", texto: "OPERATIVO" }
                            ]}
                        />
                    </div>

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
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setFormulario(usuario);
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
}