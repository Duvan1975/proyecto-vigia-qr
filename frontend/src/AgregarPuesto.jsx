import Swal from "sweetalert2";

export function AgregarPuesto() {

    const datos = {
        nombrePuesto: document.getElementById('nombrePuesto').value,
        descripcion: document.getElementById('descripcion').value,
        direccion: document.getElementById('direccion').value,
    };

    fetch("http://localhost:8080/puestosTrabajos", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
    })
        .then(async (response) => {
            if (!response.ok) {
                // eslint-disable-next-line
                const errores = await response.json(); // Esto ahora sí funciona
                const mensajes = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
                throw new Error(mensajes); // Disparamos los errores
            }
            return response.json();
        })
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El usuario ha sido registrado correctamente.',
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                html: error.message, // mostramos todos los errores formateados
            });
        });

}
