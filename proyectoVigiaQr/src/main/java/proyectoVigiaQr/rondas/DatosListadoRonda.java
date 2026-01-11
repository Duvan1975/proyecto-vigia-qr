package proyectoVigiaQr.rondas;

import java.time.LocalDate;
import java.time.LocalTime;

public record DatosListadoRonda(
        Long id,
        LocalDate fecha,
        LocalTime hora,
        String usuario,
        String puestoTrabajo,
        String ubicacionQr,
        String observaciones
) {
    public DatosListadoRonda(Ronda ronda) {
        this(
                ronda.getId(),
                ronda.getFecha(),
                ronda.getHora(), ronda.getUsuario().getNombres() + " " + ronda.getUsuario().getApellidos(),
                ronda.getPuestoTrabajo().getNombrePuesto(),
                ronda.getCodigoQR().getUbicacion(),
                ronda.getObservaciones()
        );
    }
}
