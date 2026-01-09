package proyectoVigiaQr.codigosQR;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CodigoQRRepository extends JpaRepository<CodigoQR, Long> {
    boolean existsByUbicacionAndPuestosTrabajoIdAndEstadoTrue(
            String ubicacion,
            Long idPuestosTrabajo
    );
}
