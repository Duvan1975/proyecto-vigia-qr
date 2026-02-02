import { CuadrosTexto } from "./CuadrosTexto";
import { CuadrosSelect } from "./CuadrosSelect";
import { AgregarTabla } from "./AgregarTabla";
import { useState } from "react";

export function FormularioUsuarios() {

    const [usuario, setUsuario] = useState({
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        username: "",
        password: "",
        rol: ""
    });

    const limpiarFormulario = () => {
        setUsuario({
            nombres: "",
            apellidos: "",
            tipoDocumento: "",
            numeroDocumento: "",
            username: "",
            password: "",
            rol: ""
        });
    }

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
                    value={usuario.nombres}
                    onChange={(e) => setUsuario({ ...usuario, nombres: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Apellidos:"
                    tipoinput="text"
                    nombreinput="apellidos"
                    idinput="apellidos"
                    placeholderinput="Ingrese los apellidos"
                    value={usuario.apellidos}
                    onChange={(e) => setUsuario({ ...usuario, apellidos: e.target.value })}
                />
                <CuadrosSelect
                    tamanoinput="col-md-3"
                    titulolabel="Tipo Documento:"
                    nombreinput="tipoDocumento"
                    idinput="tipoDocumento"
                    value={usuario.tipoDocumento}
                    onChange={(e) => setUsuario({ ...usuario, tipoDocumento: e.target.value })}
                    opciones={[
                        { valor: "CC", texto: "CC" },
                        { valor: "CE", texto: "CE" },
                        { valor: "PASAPORTE", texto: "PASAPORTE" }
                    ]}
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
                    value={usuario.numeroDocumento}
                    onChange={(e) => setUsuario({ ...usuario, numeroDocumento: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Usuario:"
                    tipoinput="text"
                    nombreinput="username"
                    idinput="username"
                    placeholderinput="Ingrese el nombre de usuario"
                    value={usuario.username}
                    onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Contraseña:"
                    tipoinput="password"
                    nombreinput="password"
                    idinput="password"
                    placeholderinput="Ingrese la contraseña"
                    value={usuario.password}
                    onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
                />
                <CuadrosSelect
                    tamanoinput="col-md-3"
                    titulolabel="Rol:"
                    nombreinput="rol"
                    idinput="rol"
                    value={usuario.rol}
                    onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
                    opciones={[
                        { valor: "ADMINISTRATIVO", texto: "ADMINISTRATIVO" },
                        { valor: "OPERATIVO", texto: "OPERATIVO" }
                    ]}
                />
            </div>
            <br></br>

            <div className="d-flex gap-2">
                <button
                    onClick={() => AgregarTabla(usuario, limpiarFormulario)}
                    className='botonregistrar btn btn-success'
                >
                    Registrar Usuario
                </button>
                <button
                    onClick={limpiarFormulario}
                    className="btn btn-secondary"
                >
                    Cancelar
                </button>
            </div>

            <br></br>
        </div>
    )
};