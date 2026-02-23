package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.domain.rondas.DatosExportacionRondas;
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
    public Page<DatosListadoRonda> listarTodas(
            @PageableDefault(size = 10) Pageable paginacion
            ) {
        return rondaService.listarTodas(paginacion);
    }
    @GetMapping("/exportar")
    public ResponseEntity<List<DatosExportacionRondas>> exportarRondas(
            @RequestParam(required = false) String nombrePuesto,
            @RequestParam(required = false) String nombreUsuario,
            @RequestParam(required = false) String fecha
    ) {
        List<DatosExportacionRondas> rondas;

        // Aplicar filtros según lo que llegue
        if (nombrePuesto != null && !nombrePuesto.trim().isEmpty()) {
            rondas = rondaService.listarPorNombrePuestoSinPaginacion(nombrePuesto);
        } else if (nombreUsuario != null && !nombreUsuario.trim().isEmpty()) {
            rondas = rondaService.listarPorNombreUsuarioSinPaginacion(nombreUsuario);
        } else if (fecha != null && !fecha.trim().isEmpty()) {
            rondas = rondaService.listarPorFechaSinPaginacion(LocalDate.parse(fecha));
        } else {
            // Sin filtros: exportar TODO
            rondas = rondaService.listarTodasParaExportacion();
        }

        return ResponseEntity.ok(rondas);
    }

    @GetMapping("/puesto/{idPuesto}")
    public ResponseEntity<Page<DatosListadoRonda>> listarPorPuesto(
            @PathVariable Long idPuesto,
            @PageableDefault(
                    size = 20, sort = "fecha", direction = Sort.Direction.DESC
            )Pageable paginacion
    ) {
        return ResponseEntity.ok(rondaService.listarPorPuesto(idPuesto, paginacion));
    }

    @GetMapping("/puesto/nombre")
    public ResponseEntity<Page<DatosListadoRonda>> listarPorNombrePuesto(
            @RequestParam(value = "nombre", required = false) String nombrePuesto,
            @PageableDefault(size = 20, sort = "fecha", direction = Sort.Direction.DESC) Pageable paginacion
    ) {
        try {
            Page<DatosListadoRonda> resultado;

            if (nombrePuesto == null || nombrePuesto.trim().isEmpty()) {
                // Si no se proporciona nombre, devolver todas las rondas
                resultado = rondaService.listarTodas(paginacion);
            } else {
                // Buscar por nombre
                resultado = rondaService.listarPorNombrePuesto(nombrePuesto, paginacion);
            }

            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Page.empty(paginacion));
        }
    }

    @GetMapping("/usuario/nombre")
    public ResponseEntity<Page<DatosListadoRonda>> listarPorNombreUsuario(
            @RequestParam(value = "nombre", required = false) String nombres,
            @PageableDefault (size = 20, sort = "fecha", direction = Sort.Direction.DESC) Pageable paginacion
    ) {
        try {
            Page<DatosListadoRonda> resultado;

            if (nombres == null || nombres.trim().isEmpty()) {
                // Si no se proporciona nombre, devolver todas las rondas
                resultado = rondaService.listarTodas(paginacion);
            } else {
                // Buscar por nombre de usuario
                resultado = rondaService.listarPorNombreUsuario(nombres, paginacion);
            }

            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Page.empty(paginacion));
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<DatosListadoRonda>> listarPorUsuario(
            @PathVariable Long idUsuario
    ) {
        return ResponseEntity.ok(rondaService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<Page<DatosListadoRonda>> listarPorFecha(
            @PathVariable String fecha,
            @PageableDefault(size = 20, sort = "fecha", direction = Sort.Direction.DESC) Pageable paginacion
    ) {
        return ResponseEntity.ok(
                rondaService.listarPorFecha(LocalDate.parse(fecha), paginacion)
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
