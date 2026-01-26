package proyectoVigiaQr.domain.codigosQR;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DatosActualizarCodigoQR(
        @NotNull
        Long id,
        String descripcion,
        String ubicacion,
        Boolean estado
) {
}
