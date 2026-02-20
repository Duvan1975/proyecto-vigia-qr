import { jwtDecode } from "jwt-decode";

export const getUsuarioFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Token inválido");
        return null;
    }
};