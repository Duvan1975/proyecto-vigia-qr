package proyectoVigiaQr.domain.usuario;

public record DatosRespuestaUsuario(
        Long id,
        String nombres,
        String apellidos,
        TipoDocumento tipoDocumento,
        String numeroDocumento,
        String username,
        Rol rol,
        Boolean estado
) {
    public DatosRespuestaUsuario(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.isEstado()
        );
    }
}
