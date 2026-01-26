package proyectoVigiaQr.domain.codigosQR;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import proyectoVigiaQr.domain.puestosTrabajo.PuestosTrabajo;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "CodigoQR")
@Table(name = "codigos_qr")
@EqualsAndHashCode(of = "id")
public class CodigoQR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String valorQr;

    @Column(length = 150)
    private String descripcion;

    @Column(length = 150, nullable = false)
    private String ubicacion;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private boolean estado = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_puesto", nullable = false)
    private PuestosTrabajo puestosTrabajo;

    public CodigoQR(String descripcion,
                    String ubicacion,
                    PuestosTrabajo puestosTrabajo) {

        this.valorQr = UUID.randomUUID().toString();
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.puestosTrabajo = puestosTrabajo;
        this.fechaCreacion = LocalDateTime.now();
        this.estado = true;
    }
    public CodigoQR() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValorQr() {
        return valorQr;
    }

    public void setValorQr(String valorQr) {
        this.valorQr = valorQr;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public PuestosTrabajo getPuestosTrabajo() {
        return puestosTrabajo;
    }

    public void setPuestosTrabajo(PuestosTrabajo puestosTrabajo) {
        this.puestosTrabajo = puestosTrabajo;
    }

    public void actualizarDatos(DatosActualizarCodigoQR datos) {
        if (datos.descripcion() != null) {
            this.descripcion = datos.descripcion();
        }

        if (datos.ubicacion() != null) {
            this.ubicacion = datos.ubicacion();
        }

        if (datos.estado() != null) {
            this.estado = datos.estado();
        }
    }
}
