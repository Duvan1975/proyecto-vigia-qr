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
        .then((response) => {
            if (!response.ok) {
                // eslint-disable-next-line
                throw new ("Error al registrar");
            }
            return response.text();
        })
        .then((data) => {
            alert("Registro Exitoso");
            agregarFila(datos);
        })
        .catch((error) => {
            console.error("Error", error);
            alert("Se presento un problema al registrar el puesto de trabajo");
        });
    function agregarFila(datos) {
        const tablaPuesto = document.getElementById('tablaPuesto').getElementsByTagName('tbody')[0];
        const fila = tablaPuesto.insertRow(0);

        fila.insertCell(0).innerText = datos.nombrePuesto;
        fila.insertCell(1).innerText = datos.descripcion;
        fila.insertCell(2).innerText = datos.direccion;
    }
}