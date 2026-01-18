package proyectoVigiaQr.domain.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsBynumeroDocumento(@NotBlank @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos") String s);

    Optional<Usuario> findBynumeroDocumento(String numeroDocumento);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.numeroDocumento = :numeroDocumento AND u.id != :id")
    boolean existsByNumeroDocumentoAndIdNot(@Param("numeroDocumento") String numeroDocumento, @Param("id") Long id);
}
