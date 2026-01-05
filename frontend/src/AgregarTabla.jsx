export function AgregarTabla() {

    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];

    var fila = tabla.insertRow(0);

    var columna1 = fila.insertCell(0);
    var columna2 = fila.insertCell(1);
    var columna3 = fila.insertCell(2);
    var columna4 = fila.insertCell(3);
    var columna5 = fila.insertCell(4);
    var columna6 = fila.insertCell(5);
    var columna7 = fila.insertCell(6);

    columna1.innerText = nombres;
    columna2.innerText = apellidos;
    columna3.innerText = tipoDocumento;
    columna4.innerText = numeroDocumento;
    columna5.innerText = username;
    columna6.innerText = password;
    columna7.innerText = rol;
    
};