package proyectoVigiaQr.domain.puestosTrabajo;

import jakarta.validation.constraints.NotNull;

public record DatosActualizarPuesto(
        @NotNull
        Long id,
        String nombrePuesto,
        String descripcion,
        String direccion,
        Boolean estado
) {
}
