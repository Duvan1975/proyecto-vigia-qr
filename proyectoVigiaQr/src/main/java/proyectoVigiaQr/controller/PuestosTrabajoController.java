package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

}
