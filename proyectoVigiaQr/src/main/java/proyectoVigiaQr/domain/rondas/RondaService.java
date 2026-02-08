package proyectoVigiaQr.domain.rondas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import proyectoVigiaQr.domain.codigosQR.CodigoQR;
import proyectoVigiaQr.domain.codigosQR.CodigoQRRepository;
import proyectoVigiaQr.domain.puestosTrabajo.PuestosTrabajo;
import proyectoVigiaQr.domain.usuario.Usuario;
import proyectoVigiaQr.domain.usuario.UsuarioRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class RondaService {

    private final RondaRepository rondaRepository;
    private final CodigoQRRepository codigoQRRepository;
    private final UsuarioRepository usuarioRepository;

    public RondaService(RondaRepository rondaRepository,
                        CodigoQRRepository codigoQRRepository,
                        UsuarioRepository usuarioRepository) {
        this.rondaRepository = rondaRepository;
        this.codigoQRRepository = codigoQRRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void registrarRonda(DatosRegistroRonda datos) {

        //Validar Usuario
        Usuario usuario = usuarioRepository.findById(datos.idUsuario())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuario no encontrado"
                ));

        //Validar Código QR
        CodigoQR codigoQR = codigoQRRepository.findByValorQr(datos.valorQr())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Código QR no válido"
                ));

        if (!codigoQR.isEstado()) {
            throw new IllegalArgumentException(
                    "El código QR está inactivo"
            );
        }

        //Obtener puesto desde el QR
        PuestosTrabajo puesto = codigoQR.getPuestosTrabajo();

        //Registrar ronda
        Ronda ronda = new Ronda(
                usuario,
                codigoQR,
                puesto,
                datos.observaciones()
        );

        rondaRepository.save(ronda);
    }
    public Page<DatosListadoRonda> listarTodas(Pageable paginacion) {
        return rondaRepository.findAll(paginacion)
                .map(DatosListadoRonda::new);
    }

    public List<DatosListadoRonda> listarPorPuesto(Long idPuestoTrabajo) {
        return rondaRepository.findByPuestoTrabajoId(idPuestoTrabajo)
                .stream()
                .map(DatosListadoRonda::new)
                .toList();
    }

    public List<DatosListadoRonda> listarPorUsuario(Long idUsuario) {

        var ronda = rondaRepository.findByUsuarioId(idUsuario);

        if (ronda.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado o sin rondas registradas");
        }
        return rondaRepository.findByUsuarioId(idUsuario)
                .stream()
                .map(DatosListadoRonda::new)
                .toList();
    }

    public List<DatosListadoRonda> listarPorFecha(LocalDate fecha) {
        return rondaRepository.findByFecha(fecha)
                .stream()
                .map(DatosListadoRonda::new)
                .toList();
    }

    public Page<DatosListadoRonda> listarConFiltros(
            Long idPuesto,
            Long idUsuario,
            LocalDate fecha,
            int page,
            int size
    ) {

        Specification<Ronda> spec = Specification
                .where(RondaSpecification.porPuesto(idPuesto))
                .and(RondaSpecification.porUsuario(idUsuario))
                .and(RondaSpecification.porFecha(fecha));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("fecha").descending().and(Sort.by("hora").descending())
        );

        return rondaRepository.findAll(spec, pageable)
                .map(DatosListadoRonda::new);
    }
}
