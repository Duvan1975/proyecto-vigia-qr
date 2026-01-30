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
        .then(async response => {

            // ❌ Si hay error, leemos el mensaje del backend
    if (!response.ok) {
        const errorData = await response.json(); // 👈 ahora sí JSON
        throw new Error(errorData.error);        // 👈 solo el mensaje
    }
            return response.json();
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El puesto ha sido registrado correctamente.',
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar',
                text: error.message,
            });
        });
}
