package proyectoVigiaQr.codigosQR;

import java.time.LocalDateTime;

public record DatosListadoCodigoQR(
        Long id,
        String descripcion,
        String ubicacion,
        String valorQr,
        LocalDateTime fechaCreacion,
        boolean estado
) {
    public DatosListadoCodigoQR(CodigoQR codigoQR) {
        this(
                codigoQR.getId(),
                codigoQR.getDescripcion(),
                codigoQR.getUbicacion(),
                codigoQR.getValorQr(),
                codigoQR.getFechaCreacion(),
                codigoQR.isEstado()
        );
    }
}
