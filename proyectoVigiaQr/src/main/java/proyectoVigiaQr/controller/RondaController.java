package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.domain.rondas.DatosListadoRonda;
import proyectoVigiaQr.domain.rondas.DatosRegistroRonda;
import proyectoVigiaQr.domain.rondas.RondaService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rondas")
@CrossOrigin(origins = "http://localhost:3000")
public class RondaController {

    private final RondaService rondaService;

    public RondaController(RondaService rondaService) {
        this.rondaService = rondaService;
    }

    @PostMapping
    public ResponseEntity<Void> registrarRonda(
            @RequestBody @Valid DatosRegistroRonda datos
    ) {
        rondaService.registrarRonda(datos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<DatosListadoRonda>> listarTodas() {
        return ResponseEntity.ok(rondaService.listarTodas());
    }

    @GetMapping("/puesto/{idPuesto}")
    public ResponseEntity<List<DatosListadoRonda>> listarPorPuesto(
            @PathVariable Long idPuesto
    ) {
        return ResponseEntity.ok(rondaService.listarPorPuesto(idPuesto));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<DatosListadoRonda>> listarPorUsuario(
            @PathVariable Long idUsuario
    ) {
        return ResponseEntity.ok(rondaService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<DatosListadoRonda>> listarPorFecha(
            @PathVariable String fecha
    ) {
        return ResponseEntity.ok(
                rondaService.listarPorFecha(LocalDate.parse(fecha))
        );
    }

    @GetMapping("/filtrar")
    public ResponseEntity<Page<DatosListadoRonda>> filtrarRondas(
            @RequestParam(required = false) Long idPuesto,
            @RequestParam(required = false) Long idUsuario,
            @RequestParam(required = false) String fecha,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        LocalDate fechaFiltro = fecha != null ? LocalDate.parse(fecha) : null;

        return ResponseEntity.ok(
                rondaService.listarConFiltros(
                        idPuesto,
                        idUsuario,
                        fechaFiltro,
                        page,
                        size
                )
        );
    }
}
