import { useState } from "react";
import { FormularioUsuarios } from "./FormularioUsuarios";
import { FormularioPuestos } from "./FormularioPuestos";
import { TablaPuestos } from "./TablaPuestos";
import { TablaUsuarios } from "./TablaUsuarios";

export function Menu() {
    const [vista, setVista] = useState("menu");

    return (
        <div className="container">
            <h1 className="alineartexto">VIGÍA Servicios Integrales (Usuarios)</h1>
            <div className="mb-4">
                <button
                    className="btn btn-info me-2"
                    onClick={() => setVista("menu")}
                >Inicio
                </button>
                <button
                    className="btn btn-primary me-2"
                    onClick={() => setVista("formularioUsuarios")}
                >Registrar Usuarios
                </button>
                <button className="btn btn-secondary"
                    onClick={() => setVista("tablaUsuarios")}
                >Listar Usuarios
                </button>
                <button
                    className="btn btn-primary me-2"
                    onClick={() => setVista("formularioPuestos")}
                >Registrar Puesto
                </button>
                <button className="btn btn-secondary me-2"
                    onClick={() => setVista("tablaPuestos")}
                >Listar Puestos
                </button>
            </div>
            {vista === "formularioUsuarios" && <FormularioUsuarios />}
            {vista === "tablaUsuarios" && <TablaUsuarios />}
            {vista === "formularioPuestos" && <FormularioPuestos />}
            {vista === "tablaPuestos" && <TablaPuestos />}
        </div>
    )
}