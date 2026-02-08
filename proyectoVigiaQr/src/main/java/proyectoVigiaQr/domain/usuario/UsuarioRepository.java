package proyectoVigiaQr.domain.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    UserDetails findByUsername(String username);

    boolean existsBynumeroDocumento(@NotBlank @Pattern(
            regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos") String s);

    boolean existsByUsername(
            String username
    );

    boolean existsByUsernameAndIdNot(
            String username, Long id
    );

    Optional<Usuario> findByNumeroDocumento(String numeroDocumento);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.numeroDocumento = :numeroDocumento AND u.id != :id")
    boolean existsByNumeroDocumentoAndIdNot(@Param("numeroDocumento") String numeroDocumento, @Param("id") Long id);

    //List<Usuario> findByNombresContainingIgnoreCase(String nombres);

    @Query("""
    SELECT u FROM Usuario u
    WHERE LOWER(u.nombres) LIKE %:filtro%
       OR LOWER(u.apellidos) LIKE %:filtro%
    """)
    List<Usuario> buscarUsuarioNombreCompleto(@Param("filtro") String filtro);

}
