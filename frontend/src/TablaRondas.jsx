import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";
import { authFetch } from "./utils/authFetch";

export function TablaRondas() {

    const [rondasPuesto, setRondasPuesto] = useState([]);

    //Estados para controlar la paginación
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarRondas(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarRondas = (pagina = 0) => {
        authFetch(`http://localhost:8080/rondas?page=${pagina}`)
            .then((response) => response.json())
            .then((data) => {
                setRondasPuesto(data.content);
                setTotalPaginas(data.totalPages); //Muestra el total de las páginas
                setPaginaActual(data.number); //Muestra el número actual de la página
                setTotalElementos(data.totalElements); //Trae el número de elementos de la todas las páginas
                setTamanoPagina(data.size); //Muestra la cantidad de elementos por página
            })
            .catch((error) => console.error("Error al cargar rondas:", error));
            setCargando(false);
    };

    useEffect(() => {
        authFetch("http://localhost:8080/rondas")
            .then((response) => response.json())
            .then((data) => setRondasPuesto(data.content))
            .catch((error) => console.error("Error al cargar rondas:", error));
    }, []);

    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    return (
        <>
            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />
            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                    {tamanoPagina} por página, total de registros: {totalElementos}
                </small>
            </div>
            <table className="table table-striped table-hover">
                <tr>
                    <th>Usuario</th>
                    <th>Puesto</th>
                    <th>Ubicación</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Observaciones</th>
                </tr>
                <tbody>
                    {rondasPuesto.map((ronda) => (
                        <tr key={ronda.id}>
                            <td>{ronda.usuario}</td>
                            <td>{ronda.puestoTrabajo}</td>
                            <td>{ronda.ubicacionQr}</td>
                            <td>{ronda.fecha}</td>
                            <td>{ronda.hora}</td>
                            <td>{ronda.observaciones || "-"}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}