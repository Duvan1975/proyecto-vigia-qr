import Swal from "sweetalert2";

export function AgregarTabla() {

    const datos = {

        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value
    };

    fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
    })

        .then(async (response) => {
            if (!response.ok) {
                const errores = await response.json();

                let mensaje;

                if (Array.isArray(errores)) {
                    // Caso: errores de validación (nombre, apellido, etc.)
                    mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
                } else if (errores.error) {
                    // Caso: error general como "Correo duplicado"
                    mensaje = errores.error;
                } else {
                    mensaje = 'Ocurrió un error desconocido';
                }

                throw new Error(mensaje);
            }
            return response.text();
        })
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'La persona ha sido registrada correctamente.',
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                html: error.message, // Puede ser lista o mensaje general
            });
        });
};