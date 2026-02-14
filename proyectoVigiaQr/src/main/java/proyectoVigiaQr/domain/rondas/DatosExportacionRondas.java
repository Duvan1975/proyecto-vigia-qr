package proyectoVigiaQr.domain.rondas;

import java.time.LocalDate;
import java.time.LocalTime;

public record DatosExportacionRondas(
    LocalDate fecha,
    LocalTime hora,
    String usuario,
    String puestoTrabajo,
    String ubicacionQr,
    String observaciones
) {
    public DatosExportacionRondas(Ronda ronda) {
        this(
                ronda.getFecha(),
                ronda.getHora() ,
                ronda.getUsuario().getNombres() + "" + ronda.getUsuario().getApellidos(),
                ronda.getPuestoTrabajo().getNombrePuesto(),
                ronda.getCodigoQR().getUbicacion(),
                ronda.getObservaciones()
        );
    }
}
