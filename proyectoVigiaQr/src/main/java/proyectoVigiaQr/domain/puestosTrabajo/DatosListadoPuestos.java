package proyectoVigiaQr.domain.puestosTrabajo;

public record DatosListadoPuestos(
        Long id,
        String nombrePuesto,
        String descripcion,
        String direccion,
        Boolean estado
) {
    public DatosListadoPuestos(PuestosTrabajo puestosTrabajo) {
        this(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );
    }
}
