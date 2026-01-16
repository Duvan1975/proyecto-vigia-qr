package proyectoVigiaQr.puestosTrabajo;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import proyectoVigiaQr.codigosQR.CodigoQR;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "PuestoTrabajo")
@Table(name = "puestos_trabajo")
@EqualsAndHashCode(of = "id")

public class PuestosTrabajo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String nombrePuesto;

    @Column(length = 100)
    private String descripcion;

    @Column(length = 100, nullable = false)
    private String direccion;

    @Column(nullable = false)
    private boolean estado = true;

    @OneToMany(mappedBy = "puestosTrabajo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CodigoQR> codigoQRS = new ArrayList<>();

    public PuestosTrabajo() {

    }
    public PuestosTrabajo(DatosRegistroPuestos datos) {
        this.nombrePuesto = datos.nombrePuesto();
        this.descripcion = datos.descripcion();
        this.direccion = datos.direccion();
        this.estado = datos.estado() != null ? datos.estado() : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombrePuesto() {
        return nombrePuesto;
    }

    public void setNombrePuesto(String nombrePuesto) {
        this.nombrePuesto = nombrePuesto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public void actualizarDatos(DatosActualizarPuesto datos) {

    }
}
