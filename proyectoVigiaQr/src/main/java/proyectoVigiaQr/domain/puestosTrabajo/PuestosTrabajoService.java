package proyectoVigiaQr.domain.puestosTrabajo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigiaQr.domain.codigosQR.CodigoQRRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PuestosTrabajoService {

    @Autowired
    private PuestosTrabajoRepository puestosTrabajoRepository;

    @Autowired
    private CodigoQRRepository codigoQRRepository;

    public ResponseEntity<DatosRespuestaPuestoTrabajo> registrarPuestoTrabajo(
            DatosRegistroPuestos datos,
            UriComponentsBuilder uriComponentsBuilder) {

        // 🔎 Validar duplicado
        if (puestosTrabajoRepository.existsByNombrePuesto(datos.nombrePuesto())) {
            throw new IllegalStateException(
                    "Ya existe un puesto de trabajo con el nombre: " + datos.nombrePuesto()
            );
        }

        PuestosTrabajo puestosTrabajo = new PuestosTrabajo(datos);
        puestosTrabajoRepository.save(puestosTrabajo);

        var uri = uriComponentsBuilder
                .path("puestosTrabajos/{id}")
                .buildAndExpand(puestosTrabajo.getId())
                .toUri();

        DatosRespuestaPuestoTrabajo respuesta = new DatosRespuestaPuestoTrabajo(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );

        return ResponseEntity.created(uri).body(respuesta);
    }

    public Page<DatosListadoPuestos> listarPuestosTrabajo(Pageable paginacion) {
        return puestosTrabajoRepository.findAll(paginacion).map(DatosListadoPuestos::new);
    }
    public List<DatosExportacionPuestosTrabajo> listarTodosParaExportacion() {
        return puestosTrabajoRepository.findAll()
                .stream()
                .map(DatosExportacionPuestosTrabajo::new)
                .collect(Collectors.toList());
    }
    public ResponseEntity<DatosRespuestaPuestoTrabajo> obtenerDatosPuesto(Long id) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(id);
        var datosPuesto = new DatosRespuestaPuestoTrabajo(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );
        return ResponseEntity.ok(datosPuesto);
    }

    @Transactional
    public ResponseEntity<DatosRespuestaPuestoTrabajo> actualizarPuestoTrabajo(
            DatosActualizarPuesto datos) {

        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.findById(datos.id())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Puesto de trabajo no encontrado con ID: " + datos.id()
                ));

        // 🔎 Validar duplicado SOLO si cambia el nombre
        if (datos.nombrePuesto() != null) {
            boolean existeDuplicado = puestosTrabajoRepository
                    .existsByNombrePuestoAndIdNot(
                            datos.nombrePuesto(),
                            puestosTrabajo.getId()
                    );

            if (existeDuplicado) {
                throw new IllegalStateException(
                        "Ya existe un puesto de trabajo con el nombre: " + datos.nombrePuesto()
                );
            }
        }

        // ✅ Una sola fuente de verdad
        puestosTrabajo.actualizarDatos(datos);

        return ResponseEntity.ok(
                new DatosRespuestaPuestoTrabajo(
                        puestosTrabajo.getId(),
                        puestosTrabajo.getNombrePuesto(),
                        puestosTrabajo.getDescripcion(),
                        puestosTrabajo.getDireccion(),
                        puestosTrabajo.isEstado()
                )
        );
    }

    @Transactional
    public ResponseEntity cambiarEstadoPuesto(Long id) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(id);
        puestosTrabajo.setEstado(!puestosTrabajo.isEstado());
        return ResponseEntity.noContent().build();
    }

    public void eliminarPuestoTrabajo(Long id) {

        if (!puestosTrabajoRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Puesto de trabajo no encontrado con el ID: " + id
            );
        }

        boolean tieneCodigosQr = codigoQRRepository
                .existsByPuestosTrabajoId(id);

        if (tieneCodigosQr) {
            throw new IllegalStateException(
                    "No se puede eliminar el puesto porque tiene códigos QR asociados"
            );
        }

        puestosTrabajoRepository.deleteById(id);
    }
}
