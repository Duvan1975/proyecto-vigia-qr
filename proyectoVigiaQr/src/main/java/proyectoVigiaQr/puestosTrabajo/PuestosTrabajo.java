package proyectoVigiaQr.puestosTrabajo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "PuestoTrabajo")
@Table(name = "puestos_trabajo")
@Getter
@Setter
@AllArgsConstructor
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

    public PuestosTrabajo() {

    }
    public PuestosTrabajo(DatosRegistroPuestos datos) {
        this.nombrePuesto = datos.nombrePuesto();
        this.descripcion = datos.descripcion();
        this.direccion = datos.direccion();
        this.estado = datos.estado() != null ? datos.estado() : true;
    }

}
