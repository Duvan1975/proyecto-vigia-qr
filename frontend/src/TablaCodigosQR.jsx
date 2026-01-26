
import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";

export function TablaCodigosQR() {
    const [puestoConCodigoQR, setPuestoConCodigoQR] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarPuestoConCodigoQR(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarPuestoConCodigoQR = (pagina = 0) => {
        setCargando(true);

        fetch(`http://localhost:8080/codigos-qr?page=${pagina}`)
            .then((res) => res.json())
            .then((data) => {
                setPuestoConCodigoQR(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar puestos con código QR:", error);
                setCargando(false);
            });
    };
    if (cargando) {
        return <p>Cargando listado...</p>;
    }
    if (puestoConCodigoQR.length === 0) {
        return <p className="text-center text-muted">No hay puestos con registros.</p>;
    }
    return (
        <div>
            <h4 className="mb-3">Listado de Puestos con Código QR</h4>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />

            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Descripción</th>
                        <th>Ubicación</th>
                        <th>Código QR</th>
                        <th>Fecha de Creación</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {puestoConCodigoQR.map((codigoQr) => (
                        <tr key={codigoQr.id}>
                            <td>{codigoQr.descripcion}</td>
                            <td>{codigoQr.ubicacion}</td>
                            <td>{codigoQr.valorQr}</td>
                            <td>{codigoQr.fechaCreacion}</td>
                            <td>{codigoQr.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />

            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>
        </div>
    );
}