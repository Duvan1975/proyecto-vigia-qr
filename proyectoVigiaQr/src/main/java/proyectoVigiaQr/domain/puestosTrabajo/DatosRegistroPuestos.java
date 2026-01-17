package proyectoVigiaQr.domain.puestosTrabajo;

import jakarta.validation.constraints.NotBlank;

public record DatosRegistroPuestos(
        @NotBlank(message = "El nombre, no puede estar vacío")
        String nombrePuesto,

        String descripcion,

        @NotBlank(message = "Por favor, ingrese la dirección")
        String direccion,

        Boolean estado
) {
}
