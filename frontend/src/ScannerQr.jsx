import { useState } from "react";
import Swal from "sweetalert2";
import { Html5Qrcode } from 'html5-qrcode';
import { getUsuarioFromToken } from "./utils/auth";
import { authFetch } from "./utils/authFetch";

const API = process.env.REACT_APP_API_URL;

export function ScannerQr() {

    const [scanner, setScanner] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [observaciones, setObservaciones] = useState("");

    //const [usuarioId] = useState(2);

    const usuario = getUsuarioFromToken();
    const usuarioId = usuario?.id;

    const iniciarEscaneo = async () => {
        const html5QrCode = new Html5Qrcode("qr-reader");

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    html5QrCode.stop().then(() => {
                        setIsScanning(false);
                        procesarCodigoQR(decodedText);
                    });
                },
                (errorMessage) => {
                    console.warn("Error escaneando:", errorMessage);
                }
            );

            setScanner(html5QrCode);
            setIsScanning(true);

        } catch (err) {
            console.error("Error iniciando cámara:", err);
            Swal.fire("Error", "No se pudo iniciar la cámara", "error");
        }
    };

    const detenerEscaneo = async () => {
        if (scanner) {
            await scanner.stop();
            await scanner.clear();
            setScanner(null);
        }
        setIsScanning(false);
    };

    const procesarCodigoQR = async (valorQr) => {
        if (!valorQr) {
            Swal.fire('Error', 'Código QR no válido', 'error');
            return;
        }

        // Mostrar información del código QR escaneado
        Swal.fire({
            title: 'Código QR detectado',
            //html: `<p><strong>Valor:</strong> ${valorQr.substring(0, 20)}...</p>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Registrar Ronda',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return registrarRonda(valorQr);
            }
        });
    };

    const registrarRonda = async (valorQr) => {
        try {

            if (!usuarioId) {
                Swal.fire('Error', 'Usuario no autenticado', 'Error');
                return false;
            }

            const datos = {
                valorQr: valorQr,
                idUsuario: usuarioId,
                observaciones: observaciones
            };

            const response = await authFetch(`${API}/rondas`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 201) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Ronda registrada correctamente',
                    icon: 'success',
                    timer: 2000
                });
                console.log(usuario);
                console.log("API URL:", API);
                setObservaciones('');
                return true;

            } else {
                const error = await response.json();
                throw new Error(error.message || 'Error al registrar ronda');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
            return false;
        }

    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h4 className="mb-0">Registrar Ronda</h4>
                </div>
                <div className="card-body">
                    {/* Información del usuario */}

                    {/* Campo para observaciones */}
                    <div className="mb-3">
                        <label htmlFor="observaciones" className="form-label">
                            <strong>Observaciones (Opcional)</strong>
                        </label>
                        <textarea
                            id="observaciones"
                            className="form-control"
                            rows="3"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ingresa observaciones sobre la ronda..."
                        />
                    </div>

                    {/* Controles de escaneo */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Escaneo de Código QR</h5>
                            <div>
                                {!isScanning ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={iniciarEscaneo}
                                    >
                                        Iniciar Escaneo
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger"
                                        onClick={detenerEscaneo}
                                    >
                                        Detener Escaneo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Área del escáner */}
                        <div id="qr-reader" style={{ width: '100%' }}></div>

                        {!isScanning && (
                            <div className="text-center text-muted mt-3">
                                Presiona "Iniciar Escaneo" para comenzar
                            </div>
                        )}
                    </div>



                    {/* Información adicional */}
                    <div className="alert alert-secondary">
                        <h6>Instrucciones:</h6>
                        <ul className="mb-0">
                            <li>Presiona "Iniciar Escaneo" para activar la cámara</li>
                            <li>Enfoca el código QR del puesto de trabajo</li>
                            <li>La ronda se registrará automáticamente</li>
                            <li>Puedes agregar observaciones si es necesario</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}