package proyectoVigiaQr.rondas;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RondaRepository extends JpaRepository<Ronda, Long> {

    List<Ronda> findByPuestoTrabajoId(Long idPuestoTrabajo);

    List<Ronda> findByUsuarioId(Long idUsuario);

    List<Ronda> findByFecha(LocalDate fecha);
}
