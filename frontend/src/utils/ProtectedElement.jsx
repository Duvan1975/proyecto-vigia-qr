export const ProtectedElement = ({ children, allowedRoles }) => {
    // Obtener el rol del usuario desde localStorage
    const userRol = localStorage.getItem("rol");
    
    // Verificar si el usuario tiene uno de los roles permitidos
    const hasAccess = allowedRoles.includes(userRol);
    
    // Si no tiene acceso, no renderizar nada
    if (!hasAccess) {
        return null;
    }
    
    // Si tiene acceso, renderizar los children
    return children;
};

export default ProtectedElement;