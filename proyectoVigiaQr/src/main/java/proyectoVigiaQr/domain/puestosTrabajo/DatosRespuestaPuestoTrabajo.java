package proyectoVigiaQr.domain.puestosTrabajo;

public record DatosRespuestaPuestoTrabajo(
        Long id,
        String nombrePuesto,
        String descripcion,
        String direccion,
        Boolean estado
) {
    public DatosRespuestaPuestoTrabajo(PuestosTrabajo puestosTrabajo) {
        this(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );
    }
}
