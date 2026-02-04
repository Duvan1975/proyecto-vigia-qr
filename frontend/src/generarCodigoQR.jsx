import { idPuestoCreado } from "./AgregarPuesto";
import { authFetch } from "./utils/authFetch";

export function generarCodigoQR() {

    const datos = {
        descripcion: document.getElementById("descripcionQr").value,
        ubicacion: document.getElementById("ubicacionQr").value,
        idPuestosTrabajo: idPuestoCreado
    };

    authFetch("http://localhost:8080/codigos-qr", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al generar el código QR");
            }
            return response;
        })
        .then(() => {
            alert("Código QR generado correctamente");

            // habilitamos el botón de descarga
            const btn = document.getElementById("btnDescargarQr");
            btn.disabled = false;

            // guardamos el ID (por ahora manual)
            btn.onclick = () => descargarQR();
        })
        .catch(error => {
            console.error(error);
            alert("Error al generar el código QR");
        });

    function descargarQR() {
        const idQr = prompt("Ingrese el ID del código QR a descargar");

        window.open(
            `http://localhost:8080/codigos-qr/${idQr}/descargar`,
            "_blank"
        );
    }

}
