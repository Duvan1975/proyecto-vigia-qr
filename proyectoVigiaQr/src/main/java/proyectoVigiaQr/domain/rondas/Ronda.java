package proyectoVigiaQr.domain.rondas;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import proyectoVigiaQr.domain.codigosQR.CodigoQR;
import proyectoVigiaQr.domain.puestosTrabajo.PuestosTrabajo;
import proyectoVigiaQr.domain.usuario.Usuario;

import java.time.*;

@Entity(name = "Ronda")
@Table(name = "rondas")
@EqualsAndHashCode(of = "id")
public class Ronda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(length = 255)
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false )
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_codigo_qr", nullable = false)
    private CodigoQR codigoQR;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_puesto_trabajo", nullable = false)
    private PuestosTrabajo puestoTrabajo;

    public Ronda(Usuario usuario,
                 CodigoQR codigoQR,
                 PuestosTrabajo puestosTrabajo,
                 String observaciones) {
        this.usuario = usuario;
        this.codigoQR = codigoQR;
        this.puestoTrabajo = puestosTrabajo;
        this.observaciones = observaciones;
        // La fecha y hora se asignarán automáticamente con @PrePersist
    }

    /**
     * Este método se ejecuta automáticamente ANTES de guardar la entidad en la base de datos.
     * Asigna la fecha y hora actual del servidor en UTC.
     */
    @PrePersist
    protected void onCreate() {
        ZonedDateTime ahora = ZonedDateTime.now(ZoneId.of("America/Bogota"));
        this.fecha = ahora.toLocalDate();
        this.hora = ahora.toLocalTime();
    }
    public Ronda() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public CodigoQR getCodigoQR() {
        return codigoQR;
    }

    public void setCodigoQR(CodigoQR codigoQR) {
        this.codigoQR = codigoQR;
    }

    public PuestosTrabajo getPuestoTrabajo() {
        return puestoTrabajo;
    }

    public void setPuestoTrabajo(PuestosTrabajo puestoTrabajo) {
        this.puestoTrabajo = puestoTrabajo;
    }
}
