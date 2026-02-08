import { useState, useEffect } from "react";
import { FormularioUsuarios } from "./FormularioUsuarios";
import { FormularioPuestos } from "./FormularioPuestos";
import { TablaPuestos } from "./TablaPuestos";
import { TablaUsuarios } from "./TablaUsuarios";
import { TablaRondas } from "./TablaRondas";
import { ScannerQr } from "./ScannerQr";
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
        localStorage.removeItem("admin");
        localStorage.removeItem("estado");
        setIsLoggedIn(false);
        setVista("login");
    };

    return (
        <div className="container">
            {/* Mostrar título SOLO cuando esté logueado */}
            {isLoggedIn && (
                <h1 className="alinearTexto">VIGÍA Servicios Integrales</h1>
            )}

            {/* Mostrar información del usuario si está logueado */}
            {isLoggedIn && (
                <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                    <span>
                        Usuario: <strong>{localStorage.getItem("username")}</strong> |
                        Rol: <strong>{localStorage.getItem("rol")}</strong>
                    </span>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            )}

            {/* Mostrar botones del menú SOLO cuando esté logueado Y NO esté en vista login */}
            {isLoggedIn && vista !== "login" && (
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
                    <button className="btn btn-secondary me-2"
                        onClick={() => setVista("tablaRondas")}
                    >Listado de Rondas
                    </button>
                    <button className="btn btn-secondary me-2"
                        onClick={() => setVista("scannerQr")}
                    >Escanear Código
                    </button>

                </div>
            )}
            {/* Mostrar botón de login SOLO cuando NO esté logueado Y NO esté en vista login */}
            {!isLoggedIn && vista !== "login" && (
                <div className="text-center mb-4">
                    <button className="btn btn-primary btn-lg" onClick={() => setVista("login")}>
                        Iniciar Sesión
                    </button>
                </div>
            )}

            {vista === "formularioUsuarios" && <FormularioUsuarios />}
            {vista === "tablaUsuarios" && <TablaUsuarios />}
            {vista === "formularioPuestos" && <FormularioPuestos />}
            {vista === "tablaPuestos" && <TablaPuestos />}
            {vista === "tablaRondas" && <TablaRondas />}
            {vista === "scannerQr" && <ScannerQr />}

            {/* Login con callback para redirección */}
            {vista === "login" && (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}

            {/* Mostrar mensaje de bienvenida en vista "menu" cuando esté logueado */}
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
    )
}