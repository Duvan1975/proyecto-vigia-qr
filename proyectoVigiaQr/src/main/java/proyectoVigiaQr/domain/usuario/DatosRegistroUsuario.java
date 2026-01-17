package proyectoVigiaQr.domain.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DatosRegistroUsuario(
        @NotBlank(message = "El nombre, no puede estar vacío")
        String nombres,

        @NotBlank(message = "El apellido, no puede estar vacío")
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
