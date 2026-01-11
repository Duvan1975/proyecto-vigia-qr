package proyectoVigiaQr.rondas;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class RondaSpecification {

    public static Specification<Ronda> porPuesto(Long idPuesto) {
        return (root, query, cb) ->
                idPuesto == null
                        ? null
                        : cb.equal(root.get("puestoTrabajo").get("id"), idPuesto);
    }

    public static Specification<Ronda> porUsuario(Long idUsuario) {
        return (root, query, cb) ->
                idUsuario == null
                        ? null
                        : cb.equal(root.get("usuario").get("id"), idUsuario);
    }

    public static Specification<Ronda> porFecha(LocalDate fecha) {
        return (root, query, cb) ->
                fecha == null
                        ? null
                        : cb.equal(root.get("fecha"), fecha);
    }
}
