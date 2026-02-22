import { useState, useEffect } from "react";
import { FormularioUsuarios } from "./FormularioUsuarios";
import { FormularioPuestos } from "./FormularioPuestos";
import { TablaPuestos } from "./TablaPuestos";
import { TablaUsuarios } from "./TablaUsuarios";
import { TablaRondas } from "./TablaRondas";
import { ScannerQr } from "./ScannerQr";
import { ProtectedElement } from "./utils/ProtectedElement";
import { Login } from "./Login";

export function Menu() {
    const [vista, setVista] = useState("menu");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            setVista("menu");
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setVista("menu");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombres");
        localStorage.removeItem("admin");
        localStorage.removeItem("estado");
        setIsLoggedIn(false);
        setVista("login");
    };

    return (
        <div className="container">
            {/* Mostrar título SOLO cuando esté logueado */}
            {isLoggedIn && (
                <h1 className="text-center mb-4">VIGÍA Servicios Integrales</h1>
            )}

            {/* Mostrar información del usuario si está logueado */}
            {isLoggedIn && (
                <div className="alert alert-info d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                    <span className="mb-2 mb-sm-0">
                        Usuario: <strong>{localStorage.getItem("nombres")}</strong> |
                        Rol: <strong>{localStorage.getItem("rol")}</strong>
                    </span>
                    <button className="btn btn-sm btn-outline-danger w-100 w-sm-auto" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            )}

            {/* Mostrar botones del menú SOLO cuando esté logueado Y NO esté en vista login */}
            {isLoggedIn && vista !== "login" && (
                <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-md-start">
                    <button
                        className="btn btn-info"
                        onClick={() => setVista("menu")}
                    >Inicio
                    </button>

                    <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setVista("formularioUsuarios")}
                        >Registrar Usuarios
                        </button>
                    </ProtectedElement>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setVista("tablaUsuarios")}
                    >Listar Usuarios
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => setVista("formularioPuestos")}
                    >Registrar Puesto
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setVista("tablaPuestos")}
                    >Listar Puestos
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setVista("tablaRondas")}
                    >Listado de Rondas
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setVista("scannerQr")}
                    >Escanear Código
                    </button>
                </div>
            )}

            {/* Mostrar botón de login SOLO cuando NO esté logueado Y NO esté en vista login */}
            {!isLoggedIn && vista !== "login" && (
                <div className="text-center mb-4">
                    <button className="btn btn-primary btn-lg w-100 w-sm-auto" onClick={() => setVista("login")}>
                        Iniciar Sesión
                    </button>
                </div>
            )}

            {/* Resto del código igual... */}
            {vista === "formularioUsuarios" && <FormularioUsuarios />}
            {vista === "tablaUsuarios" && <TablaUsuarios />}
            {vista === "formularioPuestos" && <FormularioPuestos />}
            {vista === "tablaPuestos" && <TablaPuestos />}
            {vista === "tablaRondas" && <TablaRondas />}
            {vista === "scannerQr" && <ScannerQr />}

            {vista === "login" && (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}

            {isLoggedIn && vista === "menu" && (
                <div className="text-center mt-5">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-primary">¡Bienvenido!</h3>
                            <p className="card-text">
                                Sistema de gestión Códigos QR VIGÍA Servicios Integrales
                            </p>
                            <p className="text-muted">
                                Selecciona una opción del menú para comenzar
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}