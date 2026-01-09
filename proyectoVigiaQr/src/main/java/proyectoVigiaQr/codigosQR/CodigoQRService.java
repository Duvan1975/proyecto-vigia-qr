package proyectoVigiaQr.codigosQR;

import org.springframework.stereotype.Service;
import proyectoVigiaQr.puestosTrabajo.PuestosTrabajo;
import proyectoVigiaQr.puestosTrabajo.PuestosTrabajoRepository;

@Service
public class CodigoQRService {

    private final CodigoQRRepository codigoQRRepository;
    private final PuestosTrabajoRepository puestosTrabajoRepository;

    public CodigoQRService(CodigoQRRepository codigoQRRepository,
                           PuestosTrabajoRepository puestosTrabajoRepository) {

        this.codigoQRRepository = codigoQRRepository;
        this.puestosTrabajoRepository = puestosTrabajoRepository;
    }

    public CodigoQR registrarCodigoQR(DatosRegistroCodigoQR datos) {

        PuestosTrabajo puesto = puestosTrabajoRepository.findById(datos.idPuestosTrabajo())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El puesto de trabajo no existe"
                ));

        boolean existeQrActivo = codigoQRRepository
                .existsByUbicacionAndPuestosTrabajoIdAndEstadoTrue(
                        datos.ubicacion(),
                        puesto.getId()
                );

        if (existeQrActivo) {
            throw new IllegalStateException(
                    "Ya existe un código QR activo para esta ubicación en el puesto"
            );
        }

        // 3️⃣ Crear y guardar QR
        CodigoQR codigoQR = new CodigoQR(
                datos.descripcion(),
                datos.ubicacion(),
                puesto
        );

        return codigoQRRepository.save(codigoQR);
    }
}
