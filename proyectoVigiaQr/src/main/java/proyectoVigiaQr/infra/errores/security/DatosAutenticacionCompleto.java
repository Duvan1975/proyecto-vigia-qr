package proyectoVigiaQr.infra.errores.security;

public record DatosAutenticacionCompleto(
        String token,
        String rol,
        boolean estado,
        String username
) {
}
