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
            alert("Se presento un problema al registrar el usuario");
        });

    function agregarFila(datos) {
        const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
        const fila = tabla.insertRow(0);

        fila.insertCell(0).innerText = datos.nombres;
        fila.insertCell(1).innerText = datos.apellidos;
        fila.insertCell(2).innerText = datos.tipoDocumento;
        fila.insertCell(3).innerText = datos.numeroDocumento;
        fila.insertCell(4).innerText = datos.username;
        fila.insertCell(5).innerText = datos.password;
        fila.insertCell(6).innerText = datos.rol;
    }

};