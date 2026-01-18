package proyectoVigiaQr.domain.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DatosRegistroUsuario(
        @NotBlank
        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String nombres,

        @NotBlank
        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String apellidos,

        @NotNull(message = "Debe seleccionar el tipo de documento")
        TipoDocumento tipoDocumento,

        @NotBlank
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String numeroDocumento,

        @NotBlank(message = "El nombre del usuario, No puede estar vacío")
        String username,

        @NotBlank(message = "Debe establecer una contraseña")
        String password,

        @NotNull(message = "Debe seleccionar el tipo de rol")
        Rol rol,

        Boolean estado
) {
}
