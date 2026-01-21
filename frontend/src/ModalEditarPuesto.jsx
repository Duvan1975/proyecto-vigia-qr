import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function ModalEditarPuesto({ puestoTrabajo, visible, onClose, onActualizado }) {
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
        }
    }, [puestoTrabajo]);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const actualizarPuestoTrabajo = () => {
        fetch("http://localhost:8080/puestosTrabajos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error al actualizar");
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
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
};