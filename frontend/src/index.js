import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CuadrosTexto } from './CuadrosTexto';
import { Tabla } from './Tabla';
import { AgregarTabla } from './AgregarTabla';
import "./styles.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='container'>
    <h1 className='alineartexto'>Formulario de Registro de Usuarios</h1>
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
        tipoinput="text"
        nombreinput="tipoDocumento"
        idinput="tipoDocumento"
        placeholderinput="Seleccione el tipo de documento"
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
        tipoinput="text"
        nombreinput="rol"
        idinput="rol"
        placeholderinput="Seleccione el rol"
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
        <button
      onClick={AgregarTabla}
      className='botonregistrar btn btn-success'
    >
      Registrar Usuario
    </button>
    <br></br>
    <Tabla />

  </div>
);