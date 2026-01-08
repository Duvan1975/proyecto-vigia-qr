package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.puestosTrabajo.DatosActualizarPuesto;
import proyectoVigiaQr.puestosTrabajo.DatosListadoPuestos;
import proyectoVigiaQr.puestosTrabajo.DatosRegistroPuestos;
import proyectoVigiaQr.puestosTrabajo.PuestosTrabajoService;

@RestController
@RequestMapping("/puestosTrabajos")
@CrossOrigin(origins = "http://localhost:3000")
public class PuestosTrabajoController {

    private final PuestosTrabajoService puestosTrabajoService;

    public PuestosTrabajoController(PuestosTrabajoService puestosTrabajoService) {
        this.puestosTrabajoService = puestosTrabajoService;}

    @PostMapping
    public ResponseEntity<Void> registrarPuestoTrabajo(
            @RequestBody @Valid DatosRegistroPuestos datos) {
        puestosTrabajoService.registrarPuestoTrabajo(datos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping
    public Page<DatosListadoPuestos> listadoPuestos(
            @PageableDefault(size = 20, sort = "nombrePuesto")Pageable paginacion) {
        return puestosTrabajoService.listarPuestosTrabajo(paginacion);
    }
    @PutMapping
    public void actualizarPuestoTrabajo(
            @RequestBody @Valid DatosActualizarPuesto datos) {
            puestosTrabajoService.actualizarPuestoTrabajo(datos);
    }
    @DeleteMapping("/{id}")
    public void eliminarPuestoTrabajo(@PathVariable Long id) {
        puestosTrabajoService.eliminarPuestoTrabajo(id);
    }
}
