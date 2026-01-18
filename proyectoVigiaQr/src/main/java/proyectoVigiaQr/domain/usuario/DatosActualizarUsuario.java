package proyectoVigiaQr.domain.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DatosActualizarUsuario(
        @NotNull
        Long id,

        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String nombres,

        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String apellidos,

        TipoDocumento tipoDocumento,
        String numeroDocumento,
        String username,
        String password,
        Rol rol,
        Boolean estado
) {
}
