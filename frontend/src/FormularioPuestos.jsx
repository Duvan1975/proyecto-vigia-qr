import { CuadrosTexto } from "./CuadrosTexto";
import { AgregarPuesto } from "./AgregarPuesto";
import { generarCodigoQR } from "./generarCodigoQR";

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
            <br></br>
            <h2 className="alineartexto">Asignar Código QR</h2>

            <div className="row">
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Descripción QR:"
                    tipoinput="text"
                    nombreinput="descripcionQr"
                    idinput="descripcionQr"
                    placeholderinput="Descripción del QR"
                />

                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Ubicación:"
                    tipoinput="text"
                    nombreinput="ubicacionQr"
                    idinput="ubicacionQr"
                    placeholderinput="Ubicación"
                />

                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="ID Puesto:"
                    tipoinput="number"
                    nombreinput="idPuestoTrabajo"
                    idinput="idPuestoTrabajo"
                    placeholderinput="ID del puesto"
                />
            </div>

            <br />

            <button
                onClick={generarCodigoQR}
                className="btn btn-primary"
            >
                Generar Código QR
            </button>

            <button
                id="btnDescargarQr"
                disabled
                className="btn btn-secondary ms-2"
            >
                Descargar QR
            </button>


        </div>
    )
}