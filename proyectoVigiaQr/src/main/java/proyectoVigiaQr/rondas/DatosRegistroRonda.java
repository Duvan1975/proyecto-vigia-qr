package proyectoVigiaQr.rondas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DatosRegistroRonda(

        @NotBlank(message = "El valor del QR es obligatorio")
        String valorQr,

        @NotNull(message = "El usuario es obligatorio")
        Long idUsuario,

        String observaciones
) {
}
