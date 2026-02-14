package proyectoVigiaQr.domain.rondas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RondaRepository
        extends JpaRepository<Ronda, Long>,
        JpaSpecificationExecutor<Ronda> {

    Page<Ronda> findByPuestoTrabajoId(Long idPuestoTrabajo, Pageable paginacion);

    @Query("""
            SELECT r FROM Ronda r WHERE LOWER(
            r.puestoTrabajo.nombrePuesto)
            LIKE LOWER(CONCAT('%', :nombrePuesto, '%'))
            """)
    Page<Ronda> findByNombrePuestoContaining(
            @Param("nombrePuesto") String nombrePuesto, Pageable paginacion);


    @Query("""
       SELECT r FROM Ronda r
       WHERE LOWER(CONCAT(r.usuario.nombres, ' ', r.usuario.apellidos))
       LIKE LOWER(CONCAT('%', :nombre, '%'))
       """)
    Page<Ronda> findByNombreCompletoContainingIgnoreCase(
            @Param("nombre") String nombre,
            Pageable paginacion);


    List<Ronda> findByUsuarioId(Long idUsuario);

    Page<Ronda> findByFecha(LocalDate fecha, Pageable paginacion);

    List<Ronda> findByUsuarioNombresContainingIgnoreCaseOrUsuarioApellidosContainingIgnoreCase(
            String nombres, String apellidos);

    List<Ronda> findByPuestoTrabajoNombrePuestoContainingIgnoreCase(String nombrePuesto);

    List<Ronda> findByFecha(LocalDate fecha);
}
