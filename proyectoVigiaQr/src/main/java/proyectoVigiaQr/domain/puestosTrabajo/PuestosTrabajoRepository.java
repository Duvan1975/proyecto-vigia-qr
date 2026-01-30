package proyectoVigiaQr.domain.puestosTrabajo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PuestosTrabajoRepository extends JpaRepository<PuestosTrabajo, Long> {

    List<PuestosTrabajo> findByNombrePuestoContainingIgnoreCase(String nombrePuesto);

    boolean existsByNombrePuesto(
            String nombrePuesto
    );

    boolean existsByNombrePuestoAndIdNot(
            String nombrePuesto, Long id
    );
}
