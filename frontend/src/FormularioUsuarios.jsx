import { CuadrosTexto } from "./CuadrosTexto";
import { AgregarTabla } from "./AgregarTabla";

export function FormularioUsuarios() {
    return (
        <div>
            <h2 className='alineartexto'>Formulario Registro de Usuarios</h2>
            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Nombres:"
                    tipoinput="text"
                    nombreinput="nombres"
                    idinput="nombres"
                    placeholderinput="Ingrese los nombres"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Apellidos:"
                    tipoinput="text"
                    nombreinput="apellidos"
                    idinput="apellidos"
                    placeholderinput="Ingrese los apellidos"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Tipo Documento:"
                    nombreinput="tipoDocumento"
                    idinput="tipoDocumento"
                    opciones={["CC", "CE", "PASAPORTE"]}
                />
            </div>
            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Número de Documento:"
                    tipoinput="number"
                    nombreinput="numeroDocumento"
                    idinput="numeroDocumento"
                    placeholderinput="Ingrese el número de documento"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Usuario:"
                    tipoinput="text"
                    nombreinput="username"
                    idinput="username"
                    placeholderinput="Ingrese el nombre de usuario"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Contraseña:"
                    tipoinput="password"
                    nombreinput="password"
                    idinput="password"
                    placeholderinput="Ingrese la contraseña"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Rol:"
                    nombreinput="rol"
                    idinput="rol"
                    opciones={["ADMINISTRATIVO", "OPERATIVO"]}
                />
            </div>
            <br></br>
            <br></br>

            <button
                onClick={AgregarTabla}
                className='botonregistrar btn btn-success'
            >
                Registrar Usuario
            </button>
            <br></br>
        </div>
    )
}