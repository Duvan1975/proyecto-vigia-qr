import { CuadrosTexto } from "./CuadrosTexto";
import { AgregarPuesto } from "./AgregarPuesto";

export function FormularioPuestos() {
    return (
        <div>
            <h2 className="alineartexto">Formulario Registro de Puestos</h2>
            <div className="row">
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Nombre del Puesto:"
                    tipoinput="text"
                    nombreinput="nombrePuesto"
                    idinput="nombrePuesto"
                    placeholderinput="Ingrese el nombre del puesto"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Descripción:"
                    tipoinput="text"
                    nombreinput="descripcion"
                    idinput="descripcion"
                    placeholderinput="Descripción"
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Dirección:"
                    tipoinput="text"
                    nombreinput="direccion"
                    idinput="direccion"
                    placeholderinput="Ingrese la dirección"
                />
            </div>
            <br />
            <button
                onClick={AgregarPuesto}
                className='botonregistrar btn btn-success'
            >
                Registrar Puesto
            </button>
        </div>
    )
}