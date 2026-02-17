import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";

const API = process.env.REACT_APP_API_URL;

export async function AgregarPuesto(datos, limpiarFormulario) {

    try {
        const responsePuesto = await authFetch(`${API}/puestosTrabajos`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(
                datos),
        });

        if (!responsePuesto.ok) {
            const errores = await responsePuesto.json();
            let mensaje = "Error en el registro del puesto";

            if (Array.isArray(errores)) {
                // Caso: errores de validación múltiples
                mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
            } else if (errores.campo && errores.error) {
                // Caso: error individual con campo (por ejemplo enum mal enviado)
                mensaje = `<strong>${errores.campo}</strong>: ${errores.error}`;
            } else if (errores.error) {
                // Caso: error general sin campo
                mensaje = errores.error;
            } else {
                mensaje = 'Ocurrió un error desconocido';
            }
            throw new Error(mensaje);
        }

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Puesto de Trabajo registrado correctamente.",
        }).then(() => {
            if (typeof limpiarFormulario === "function") {
                limpiarFormulario();
            }
        })

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error en el formulario",
            html: error.message,
        });
    }
}
