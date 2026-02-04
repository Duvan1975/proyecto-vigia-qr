import { useState } from "react";
import Swal from "sweetalert2";
import { authFetch } from "./utils/authFetch";

export function Login() {
    
    //Creando estados de usuario y contraseña
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await authFetch("http://localhost:8080/login", {
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
            localStorage.setItem("token", data.jwtToken); //Guarda el token

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Token guardado correctamente"
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
    <div className="container">
      <h2 className="mt-4 mb-3">Iniciar Sesión</h2>
      <div className="mb-3">
        <label>Usuario (username):</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Contraseña:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
}