package proyectoVigiaQr.domain.puestosTrabajo;

public record DatosExportacionPuestosTrabajo(
        String nombrePuesto,
        String descripcion,
        String direccion,
        String estado
) {
    public DatosExportacionPuestosTrabajo(PuestosTrabajo puestosTrabajo) {
        this(
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado() ? "Activo" : "Inactivo"
        );
    }
}
