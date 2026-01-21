import { useEffect, useState } from "react";
import { ModalEditarUsuario } from "./ModalEditarUsuario";
import Swal from "sweetalert2";

export function TablaUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estados de búsqueda por nombre de usuario
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        fetch("http://localhost:8080/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data.content))
            .catch((error) => console.error("Error al cargar usuario:", error));
    };

    useEffect(() => {
        fetch("http://localhost:8080/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data.content))
            .catch((error) => console.error("Error al cargar usuarios:", error));
    }, []);

    const cambiarEstadoUsuario = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${id}/estado`, {
                method: "PATCH",
            });

            if (response.ok) {

                // Actualizar lista principal
                setUsuarios(prev =>
                    prev.map(u =>
                        u.id === id ? { ...u, estado: !u.estado } : u
                    )
                );

                // 🔥 Actualizar resultado de búsqueda si es el mismo usuario
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

    const buscarUsuarioPorNombre = () => {
        if (!nombreBuscar || nombreBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Por favor ingrese un nombre válido.",
            });
            return;
        }

        fetch(`http://localhost:8080/usuarios/buscarPorNombreCompleto?filtro=${nombreBuscar}`)
            .then((res) => {
                if (!res.ok) throw new Error("Usuario no encontrado");
                return res.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    resultadoBusqueda(null);
                } else {
                    setResultadoBusqueda(data[0]); // Tratamos data como un array y tomamos la primera persona
                }
                // Mensaje de éxito muestra nombre y apellido del usuario encontrado
                Swal.fire({
                    icon: "success",
                    title: "Usuario Encontrado",
                    text: `Nombre: ${data[0].nombres} ${data[0].apellidos}`,
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
                    text: "No se encontró el empleado con ese NOMBRE.",
                });
                setResultadoBusqueda(null);
            })
    }

    return (
        <>
            <div className="mb-4">
                <h5>Buscar Usuario por Nombre</h5>
                <input
                    type="text"
                    value={nombreBuscar}
                    onChange={(e) => setNombreBuscar(e.target.value)}
                    placeholder="Ingrese el Nombre"
                    className="form-control mb-2"
                />
                <button onClick={buscarUsuarioPorNombre}
                    className="btn btn-info"
                >
                    Buscar
                </button>
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
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Número Documento</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {resultadoBusqueda ? (
                        <tr style={{ backgroundColor: "red" }}>
                            <td>{resultadoBusqueda.nombres}</td>
                            <td>{resultadoBusqueda.apellidos}</td>
                            <td>{resultadoBusqueda.numeroDocumento}</td>
                            <td>
                                <button
                                    className={`btn btn-sm ${resultadoBusqueda.estado ? "btn-success" : "btn-secondary"}`}
                                    onClick={() => {
                                        Swal.fire({
                                            title: '¿Estás seguro?',
                                            text: `¿Deseas ${resultadoBusqueda.estado ? "desactivar" : "activar"} este usuario?`,
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Sí, cambiar estado',
                                            cancelButtonText: 'Cancelar'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Si el usuario confirma, ejecutar la función original
                                                cambiarEstadoUsuario(resultadoBusqueda.id);
                                            }
                                        });
                                    }}
                                >
                                    {resultadoBusqueda.estado ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                            <td>
                                <button onClick={() => {
                                    setUsuarioSeleccionado(resultadoBusqueda);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                            </td>
                        </tr>
                    ) : (
                        usuarios.map((usu) => (
                            <tr key={usu.id}>
                                <td>{usu.nombres}</td>
                                <td>{usu.apellidos}</td>
                                <td>{usu.numeroDocumento}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${usu.estado ? "btn-success" : "btn-secondary"}`}
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Confirmar cambio de estado',
                                                text: `¿Estás seguro de ${usu.estado ? "desactivar" : "activar"} este usuario?`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, cambiar',
                                                cancelButtonText: 'Cancelar',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    cambiarEstadoUsuario(usu.id);
                                                }
                                            });
                                        }}
                                    >
                                        {usu.estado ? "Activo" : "Inactivo"}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        setUsuarioSeleccionado(usu);
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

            <ModalEditarUsuario
                usuario={usuarioSeleccionado}
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onActualizado={(usuarioActualizado) => {

                    // Actualiza la tabla principal
                    setUsuarios(prev =>
                        prev.map(u =>
                            u.id === usuarioActualizado.id ? usuarioActualizado : u
                        )
                    );

                    // 🔥 Actualiza el resultado buscado si coincide
                    setResultadoBusqueda(prev =>
                        prev && prev.id === usuarioActualizado.id
                            ? usuarioActualizado
                            : prev
                    );
                }}
            />
        </>
    )
}