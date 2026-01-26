package proyectoVigiaQr.domain.codigosQR;

import java.time.LocalDateTime;

public record DatosRespuestaCodigoQR(
        Long codigoQrId,
        String descripcion,
        String ubicacion,
        String valorQr,
        LocalDateTime fechaCreacion,
        boolean estado
) {
}
