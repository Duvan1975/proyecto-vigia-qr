package proyectoVigiaQr.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsBynumeroDocumento(@NotBlank @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos") String s);
}
