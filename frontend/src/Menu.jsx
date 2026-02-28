import { useState, useEffect } from "react";
import { FormularioUsuarios } from "./FormularioUsuarios";
import { FormularioPuestos } from "./FormularioPuestos";
import { TablaPuestos } from "./TablaPuestos";
import { TablaUsuarios } from "./TablaUsuarios";
import { TablaRondas } from "./TablaRondas";
import { ScannerQr } from "./ScannerQr";
import { ProtectedElement } from "./utils/ProtectedElement";
import { Login } from "./Login";
import logoVigia from '../src/img/logoVigia.png';
import Swal from "sweetalert2";
import "./Menu.css";

export function Menu() {
    const [vista, setVista] = useState(() => {
        return localStorage.getItem("token") ? "menu" : "login";
    });
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
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro que deseas salir?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0db208',
            cancelButtonColor: '#161f2f',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("rol");
                localStorage.removeItem("nombres");
                localStorage.removeItem("admin");
                localStorage.removeItem("estado");
                setIsLoggedIn(false);
                setVista("login");

                Swal.fire({
                    title: '¡Hasta pronto!',
                    text: 'Sesión cerrada correctamente',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {isLoggedIn && (
                <header className="menu-header">
                    <div className="header-content">
                        {/* Lado izquierdo - Logo centrado en móvil */}
                        <div className="header-left">
                            <img src={logoVigia} alt="Logo Vigía" className="header-logo" />
                        </div>

                        {/* Lado derecho - En móvil se apila verticalmente */}
                        <div className="header-right">
                            <div className="header-contact">
                                <div>
                                    <span>Usuario: <strong>{localStorage.getItem("nombres")}</strong></span>
                                    <span> | Rol: <strong>{localStorage.getItem("rol")}</strong></span>
                                </div>
                            </div>
                            <button className="btn-logout" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <main className="container flex-grow-1 py-4">
                {isLoggedIn && (
                    <div className="text-center mb-4">
                        <h1 style={{ color: "#161f2f", fontWeight: "bold", marginBottom: "5px" }}>
                            VIGÍA
                        </h1>
                    </div>
                )}

                {/* Mostrar botones del menú SOLO cuando esté logueado Y NO esté en vista login */}
                {isLoggedIn && vista !== "login" && (
                    <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-md-start">
                        <button
                            className="btn"
                            style={{
                                backgroundColor: "#ffff01",
                                color: "#161f2f",
                                border: "none",
                                fontWeight: "500"
                            }}
                            onClick={() => setVista("menu")}
                        >🏠 Inicio
                        </button>

                        <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#161f2f",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "500"
                                }}
                                onClick={() => setVista("formularioUsuarios")}
                            >📝 Registrar Usuarios
                            </button>
                        </ProtectedElement>

                        <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#161f2f",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "500"
                                }}
                                onClick={() => setVista("formularioPuestos")}
                            >🏢 Registrar Puesto
                            </button>
                        </ProtectedElement>

                        <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#969595",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "500"
                                }}
                                onClick={() => setVista("tablaUsuarios")}
                            >📋 Listar Usuarios
                            </button>
                        </ProtectedElement>

                        <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#969595",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "500"
                                }}
                                onClick={() => setVista("tablaPuestos")}
                            >📋 Listar Puestos
                            </button>
                        </ProtectedElement>

                        <ProtectedElement allowedRoles={["ADMINISTRATIVO"]}>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#969595",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "500"
                                }}
                                onClick={() => setVista("tablaRondas")}
                            >🔄 Listar Rondas
                            </button>
                        </ProtectedElement>

                        <button
                            className="btn"
                            style={{
                                backgroundColor: "#161f2f",
                                color: "white",
                                border: "none",
                                fontWeight: "500"
                            }}
                            onClick={() => setVista("scannerQr")}
                        >📷 Escanear Código
                        </button>
                    </div>
                )}

                {/* Mostrar botón de login SOLO cuando NO esté logueado */}
                {!isLoggedIn && vista !== "login" && (
                    <div className="text-center mb-4">
                        <button
                            className="btn btn-lg w-100 w-sm-auto"
                            style={{
                                backgroundColor: "#ffff01",
                                color: "#161f2f",
                                border: "none",
                                fontWeight: "bold"
                            }}
                            onClick={() => setVista("login")}
                        >
                            🔑 Iniciar Sesión
                        </button>
                    </div>
                )}

                {/* Vistas dinámicas */}
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
                                <h3 className="card-title" style={{ color: "#161f2f" }}>¡Bienvenido!</h3>
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
            </main>

            {/* FOOTER */}
            {isLoggedIn && (
                <footer className="menu-footer">
                    <div className="footer-content text-center">
                        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-1 gap-md-4">
                            <div className="footer-address">
                                <span className="footer-icon">📍</span>
                                Carrera 42 a Número 10 C 12
                            </div>
                            <div className="footer-contact">
                                <span className="footer-icon">📞</span>
                                3138678521
                            </div>
                            <div className="footer-email">
                                <span className="footer-icon">✉️</span>
                                josedanilocubidez@gmail.com
                            </div>
                            <div className="footer-email">
                                <span className="footer-icon">✉️</span>
                                vigiaserviciosintegrales@gmail.com
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}