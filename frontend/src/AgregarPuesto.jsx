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
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al registrar");
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El puesto ha sido registrado correctamente.',
            });

        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                html: error.message, // mostramos todos los errores formateados
            });
        });
}


