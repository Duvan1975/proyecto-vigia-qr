import { useEffect, useState } from "react";
import { ModalEditarUsuario } from "./ModalEditarUsuario";
import Paginacion from "./Paginacion";
import Swal from "sweetalert2";

export function TablaUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estados de búsqueda por nombre de usuario
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState([]);

    //Estado de búsqueda por número de documento
    const [documentoBuscar, setDocumentoBuscar] = useState("");

    //Estado para controlar el tipo de búsqueda
    const [tipoBusqueda, setTipoBusqueda] = useState("nombre");

    //Estados para controlar la paginación
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);

    useEffect(() => {
        cargarUsuarios(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    //Función para manejar el tipo de búsqueda
    const manejarBusqueda = () => {
        if (tipoBusqueda === "nombre") {
            buscarUsuarioPorNombre();
        } else {
            buscarUsuarioPorDocumento();
        }
    };

    const cargarUsuarios = (pagina = 0) => {
        fetch(`http://localhost:8080/usuarios?page=${pagina}`)
            .then((response) => response.json())
            .then((data) => {
                setUsuarios(data.content);
                setTotalPaginas(data.totalPages); //Muestra el total de las páginas
                setPaginaActual(data.number); //Muestra el número actual de la página
                setTotalElementos(data.totalElements); //Trae el número de elementos de la todas las páginas
                setTamanoPagina(data.size); //Muestra la cantidad de elementos por página
            })
            .catch((error) => console.error("Error al cargar usuario:", error));
    };

    /*useEffect(() => {
        fetch("http://localhost:8080/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data.content))
            .catch((error) => console.error("Error al cargar usuarios:", error));
    }, []);*/

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
                    setResultadoBusqueda([]);
                } else {
                    setResultadoBusqueda(data); // Tratamos data como un array y tomamos la primera persona
                }
                // Mensaje de éxito muestra nombre y apellido del usuario encontrado
                Swal.fire({
                    icon: "success",
                    title: "Usuario Encontrado",
                    text: `${data.length} coincidencias encontradas`,
                    timer: 2000,
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
                setResultadoBusqueda([]);
            })
    }

    const buscarUsuarioPorDocumento = () => {
        if (!documentoBuscar || documentoBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Número de Documento Requerido",
                text: "Por favor ingrese un número válido.",
            });
            return;
        }
        //Aquí mostramos el endpoint de búsqueda por número de documento
        fetch(`http://localhost:8080/usuarios/buscarPorDocumento?numeroDocumento=${documentoBuscar}`)
            .then((res) => {
                if (!res.ok) throw new Error("Usuario no encontrado");
                return res.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    throw new Error("No se encontró el usuario con ese número de documento.");
                }
                setResultadoBusqueda(data);

                //Mensaje de éxito muestra nombre y apellido del usuario encontrado
                Swal.fire({
                    icon: "success",
                    title: "Usuario encontrado",
                    text: `Nombre: ${data[0].nombres} ${data[0].apellidos}`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);

                // Mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontró el usuario con ese número de documento.",
                });

                setResultadoBusqueda([]);
            });
    };

    return (
        <>
            <div className="mb-4">
                <h5>Buscar Usuario por:</h5>
                <div className="row">
                    <div className="col-md-4">
                        <select class="form-select"
                            aria-label="Default select example"
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                            value={tipoBusqueda}>

                            <option value="nombre">Por Nombre</option>
                            <option value="documento">Por Documento</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input
                            type={tipoBusqueda === "nombre" ? "text" : "number"}
                            value={tipoBusqueda === "nombre" ? nombreBuscar : documentoBuscar}
                            onChange={(e) =>
                                tipoBusqueda === "nombre"
                                    ? setNombreBuscar(e.target.value)
                                    : setDocumentoBuscar(e.target.value)
                            }
                            placeholder={`Ingrese ${tipoBusqueda}`}
                            className="form-control mb-2"
                        />
                    </div>
                </div>
                <button onClick={manejarBusqueda}
                    className="btn btn-info"
                >
                    Buscar
                </button>
                {resultadoBusqueda && (
                    <button
                        onClick={() => {
                            setResultadoBusqueda([]);
                            setDocumentoBuscar("");
                            setNombreBuscar("");
                            cargarUsuarios();
                        }}
                        className="btn btn-secondary"
                    >
                        Limpiar Búsqueda
                    </button>
                )}
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
                    {resultadoBusqueda.length > 0 ? (
                        resultadoBusqueda.map((usu, index) => (
                            <tr key={index}>
                                <td>{usu.nombres}</td>
                                <td>{usu.apellidos}</td>
                                <td>{usu.numeroDocumento}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${usu.estado ? "btn-success" : "btn-secondary"}`}
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: `¿Deseas ${usu.estado ? "desactivar" : "activar"} este usuario?`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, cambiar estado',
                                                cancelButtonText: 'Cancelar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    // Si el usuario confirma, ejecutar la función original
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
                        prev.map(u =>
                            u.id === usuarioActualizado.id ? usuarioActualizado : u
                        )
                    );
                }}
            />
        </>
    )
}