package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigiaQr.puestosTrabajo.*;

@RestController
@RequestMapping("/puestosTrabajos")
@CrossOrigin(origins = "http://localhost:3000")
public class PuestosTrabajoController {

    private final PuestosTrabajoService puestosTrabajoService;

    public PuestosTrabajoController(PuestosTrabajoService puestosTrabajoService) {
        this.puestosTrabajoService = puestosTrabajoService;}

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
}
