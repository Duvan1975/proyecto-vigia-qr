import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";
import { exportarAExcel } from "./utils/exportarExcel";

export function TablaCodigoQrPorPuesto({ puestoTrabajoId, actualizar, onClose }) {
    const [codigoQr, setCodigoQr] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [puesto, setPuesto] = useState("");

    useEffect(() => {
        cargarCodigoQrPorPuesto();
        // eslint-disable-next-line
    }, [puestoTrabajoId, actualizar]); // Se recarga si el ID o el contador cambian

    const cargarCodigoQrPorPuesto = () => {
        setCargando(true);
        authFetch(`http://localhost:8080/codigos-qr/puesto/${puestoTrabajoId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Datos recibidos de códigos QR:", data);
                setCodigoQr(data);
                if (data.length > 0) {
                    const nombreCompleto = `${data[0].puesto}`;
                    setPuesto(nombreCompleto);
                } else {
                    // Si no hay códigos, podrías hacer otra petición para obtener el nombre del puesto
                    authFetch(`http://localhost:8080/puestos-trabajo/${puestoTrabajoId}`)
                        .then((res) => res.json())
                        .then((puesto) => {
                            setPuesto(puesto.nombre || "");
                        })
                        .catch(() => setPuesto(""));
                }
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar códigos QR de este puesto:", error);
                setCargando(false);
            });
    };

    const descargarCodigoQr = (codigo) => {

        if (!codigo) {
            Swal.fire("Error", "Datos del código QR no disponibles", "error");
            return;
        }
        // Usar 'id' en lugar de 'codigoQrId' (como viene del backend)
        const codigoId = codigo.id;  // ← Cambio aquí

        if (!codigoId) {
            Swal.fire("Error", "ID del código QR no disponible", "error");
            return;
        }
        // Función para limpiar texto para nombre de archivo
        const limpiarTexto = (texto) => {
            if (!texto) return "sin_nombre";
            return texto
                .normalize("NFD")  // Separar acentos
                .replace(/[\u0300-\u036f]/g, "")  // Eliminar diacríticos
                .replace(/[^a-zA-Z0-9\s]/g, '')  // Solo letras, números y espacios
                .replace(/\s+/g, '_')  // Espacios a guiones bajos
                .toLowerCase();
        };

        // Preparar nombres para el archivo
        const nombrePuestoArchivo = limpiarTexto(puesto);
        const ubicacion = limpiarTexto(codigo.ubicacion);
        const nombreArchivo = `${nombrePuestoArchivo}_${ubicacion}`;

        authFetch(`http://localhost:8080/codigos-qr/${codigoId}/descargar`)
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
                // Asegúrate de tener Swal importado o usa un método alternativo
                if (window.Swal) {
                    window.Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Descargado",
                        text: `${puesto} - ${codigo.ubicacion}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(err => {
                if (window.Swal) {
                    window.Swal.fire("Error", err.message, "error");
                } else {
                    alert(`Error: ${err.message}`);
                }
            });
    };

    const exportarExcel = () => {
        const datosExportar = codigoQr.map(codigo => ({
            "Descripción": codigo.descripcion || "—",
            "Ubicación": codigo.ubicacion || "—",
            "Estado": codigo.estado
        }));

        // Nombre del archivo
        const nombreArchivo = `Rondas_${puesto.replace(/\s+/g, '_')}`;

        // Llama a la función de exportación
        exportarAExcel(datosExportar, nombreArchivo);
        // Función auxiliar para formatear fechas

    };

    if (cargando) return <p>Cargando Códigos qr...</p>;

    if (codigoQr.length === 0) {
        return <p className="text-center text-muted">Este puesto no tiene códigos QR registrados.</p>;
    }

    return (
        <div className="mt-4">
            <h4 className="mb-3">
                Listado de códigos QR {puesto && `de ${puesto}`}
            </h4>
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>

                                    <button
                            className="btn btn-success mb-3"
                            onClick={exportarExcel}
                        >
                            <i className="bi bi-file-excel"></i> Exportar todos
                        </button>

            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Descripción</th>
                        <th>Ubicación</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {codigoQr.map((codigo) => (
                        <tr key={codigo.id}>  {/* Usar codigo.id aquí también */}
                            <td>{codigo.descripcion}</td>
                            <td>{codigo.ubicacion}</td>
                            <td>
                                <span className={`badge ${codigo.estado ? 'bg-success' : 'bg-secondary'}`}>
                                    {codigo.estado ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => descargarCodigoQr(codigo)}
                                    title={!codigo.estado ? "Código inactivo" : `Descargar QR de ${codigo.ubicacion}`}
                                >
                                    <i className="bi bi-download me-1"></i>
                                    Descargar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}