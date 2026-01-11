package proyectoVigiaQr.codigosQR;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CodigoQRRepository extends JpaRepository<CodigoQR, Long> {
    boolean existsByUbicacionAndPuestosTrabajoIdAndEstadoTrue(
            String ubicacion,
            Long idPuestosTrabajo
    );
    List<CodigoQR> findByPuestosTrabajoId(Long idPuestosTrabajo);

    Optional<CodigoQR> findByValorQr(String valorQr);
}
