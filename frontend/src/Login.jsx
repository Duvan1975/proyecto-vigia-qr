import { useState } from "react";
import Swal from "sweetalert2";
import logoVigia from '../src/img/logoVigia.png'

export function Login({ onLoginSuccess }) {

  //Creando estados de usuario y contraseña
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Credenciales Incorrectas");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token); //Guarda el token
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("username", data.username);
      localStorage.setItem("estado", data.estado);

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        html: `
                    <p>Bienvenido: <strong>${data.username}</strong></p>
                    <p>Rol: <strong>${data.rol}</strong></p>
                `
      }).then(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message
      });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body p-4 text-center">

          {/* Imagen de la empresa */}
          <div className="mb-4">
            <div className="d-flex justify-content-center">
              <img
                src={logoVigia}
                alt="Logo Vigia"

              />
            </div>
            <h3 className="card-title text-primary mt-2">INICIO DE SESIÓN</h3>
            <p className="text-muted">Sistema de Gestión de Códigos QR</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">Usuario:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              style={{ borderRadius: "20px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-start w-100">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              style={{ borderRadius: "20px" }}
            />
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            onClick={handleLogin}
            style={{ borderRadius: "20px", fontSize: "18px" }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}