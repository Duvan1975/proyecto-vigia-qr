package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigiaQr.domain.puestosTrabajo.*;

import java.util.List;

@RestController
@RequestMapping("/puestosTrabajos")
@CrossOrigin(origins = "http://localhost:3000")
public class PuestosTrabajoController {

    private final PuestosTrabajoService puestosTrabajoService;

    private final PuestosTrabajoRepository puestosTrabajoRepository;

    public PuestosTrabajoController(PuestosTrabajoService puestosTrabajoService,
                                    PuestosTrabajoRepository puestosTrabajoRepository) {

        this.puestosTrabajoService = puestosTrabajoService;
        this.puestosTrabajoRepository = puestosTrabajoRepository;
    }

    @PostMapping
    public ResponseEntity<DatosRespuestaPuestoTrabajo> registrarPuestoTrabajo(
            @RequestBody @Valid DatosRegistroPuestos datos,
            UriComponentsBuilder uriComponentsBuilder) {
        return puestosTrabajoService.registrarPuestoTrabajo(datos, uriComponentsBuilder);
        //return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping
    public Page<DatosListadoPuestos> listadoPuestos(
            @PageableDefault(size = 20, sort = "nombrePuesto")Pageable paginacion) {
        return puestosTrabajoService.listarPuestosTrabajo(paginacion);
    }
    @GetMapping("/exportar")
    public ResponseEntity<List<DatosExportacionPuestosTrabajo>> exportarPuestosTrabajo() {
        List<DatosExportacionPuestosTrabajo> puestosTrabajos = puestosTrabajoService.listarTodosParaExportacion();

        return ResponseEntity.ok(puestosTrabajos);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DatosRespuestaPuestoTrabajo> obtenerDatosPuesto(@PathVariable Long id) {
        return puestosTrabajoService.obtenerDatosPuesto(id);
    }
    @PutMapping
    public ResponseEntity actualizarPuestoTrabajo(
            @RequestBody @Valid DatosActualizarPuesto datos) {
            puestosTrabajoService.actualizarPuestoTrabajo(datos);
            return puestosTrabajoService.actualizarPuestoTrabajo(datos);
    }
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id) {
        return puestosTrabajoService.cambiarEstadoPuesto(id);
    }
    @GetMapping("/buscarPorNombrePuesto")
    public ResponseEntity<List<DatosRespuestaPuestoTrabajo>> buscarPorNombrePuesto(
            @RequestParam String nombrePuesto) {
        List<PuestosTrabajo> puestosTrabajos = puestosTrabajoRepository.findByNombrePuestoContainingIgnoreCase(nombrePuesto);
        List<DatosRespuestaPuestoTrabajo> resultado = puestosTrabajos.stream()
                .map(p -> new DatosRespuestaPuestoTrabajo(
                        p.getId(),
                        p.getNombrePuesto(),
                        p.getDescripcion(),
                        p.getDireccion(),
                        p.isEstado()
                )).toList();
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPuestoTrabajo(@PathVariable Long id) {
        puestosTrabajoService.eliminarPuestoTrabajo(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
