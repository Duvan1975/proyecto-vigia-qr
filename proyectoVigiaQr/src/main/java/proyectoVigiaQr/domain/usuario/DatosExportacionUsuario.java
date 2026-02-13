package proyectoVigiaQr.domain.usuario;

public record DatosExportacionUsuario(
        String nombres,
        String apellidos,
        TipoDocumento tipoDocumento,
        String numeroDocumento,
        Rol rol,
        String estado
) {
    public DatosExportacionUsuario(Usuario usuario) {
        this(
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getRol(),
                usuario.isEstado() ? "Activo" : "Inactivo"
        );
    }
}
