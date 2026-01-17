package proyectoVigiaQr.domain.codigosQR;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DatosRegistroCodigoQR(
        String descripcion,

        @NotBlank(message = "La ubicación es obligatoria")
        String ubicacion,

        @NotNull(message = "El puesto de trabajo es obligatorio")
        Long idPuestosTrabajo
) {
}
