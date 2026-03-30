import { useState } from "react";
import { CuadrosTexto } from "./CuadrosTexto";
import { AgregarPuesto } from "./AgregarPuesto";

export function FormularioPuestos() {

    const [formulario, setFormulario] = useState({
        nombrePuesto: "",
        descripcion: "",
        direccion: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombrePuesto: "",
            descripcion: "",
            direccion: ""
        });
    };

    const registrarPuesto = () => {
        AgregarPuesto(formulario, limpiarFormulario);
    };

    return (
        <div>
            {/*<h2 className="alineartexto" style={{color: "#161f2f"}}>Formulario Registro de Puestos</h2>*/}

            <div className="row">
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Nombre del Puesto:"
                    tipoinput="text"
                    nombreinput="nombrePuesto"
                    idinput="nombrePuesto"
                    placeholderinput="Ingrese el nombre del puesto"
                    value={formulario.nombrePuesto}
                    onChange={handleChange}
                />

                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Descripción:"
                    tipoinput="text"
                    nombreinput="descripcion"
                    idinput="descripcion"
                    placeholderinput="Descripción"
                    value={formulario.descripcion}
                    onChange={handleChange}
                />

                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Dirección:"
                    tipoinput="text"
                    nombreinput="direccion"
                    idinput="direccion"
                    placeholderinput="Ingrese la dirección"
                    value={formulario.direccion}
                    onChange={handleChange}
                />
            </div>

            <br />

            <div className="d-flex gap-2">
                <button
                    onClick={registrarPuesto}
                    className="btn btn-success"
                >
                    Registrar Puesto
                </button>

                <button
                    onClick={limpiarFormulario}
                    className="btn btn-secondary"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
