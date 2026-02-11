package proyectoVigiaQr.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.domain.codigosQR.*;

import java.util.List;

@RestController
@RequestMapping("/codigos-qr")
@CrossOrigin(origins = "http://localhost:3000")
public class CodigoQRController {

    private final CodigoQRService codigoQRService;

    public CodigoQRController(CodigoQRService codigoQRService) {
        this.codigoQRService = codigoQRService;
    }

    @PostMapping("/puesto/{idPuestosTrabajo}")
    public ResponseEntity<List<DatosRespuestaCodigoQR>> registrarCodigosQR(
            @PathVariable Long idPuestosTrabajo,
            @RequestBody @Valid List<DatosRegistroCodigoQR> listaDatos
    ) {

        List<DatosRespuestaCodigoQR> respuesta =
                codigoQRService.registrarCodigosQR(idPuestosTrabajo, listaDatos);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }

    @GetMapping("/puesto/{idPuesto}")
    public ResponseEntity<List<DatosListadoCodigoQR>> listarPorPuesto(
            @PathVariable Long idPuesto
    ) {
        return ResponseEntity.ok(codigoQRService.listarPorPuesto(idPuesto));
    }

    @GetMapping("/{id}/descargar")
    public ResponseEntity<byte[]> descargarCodigoQr(@PathVariable Long id) {

        byte[] imagenQr = codigoQRService.generarImagenQr(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=codigo_qr_" + id + ".png")
                .header("Content-Type", "image/png")
                .body(imagenQr);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoCodigoQR>> listadoCodigosQR(
            @PageableDefault(size = 10)Pageable paginacion) {
        return codigoQRService.listarCodigosQR(paginacion);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaCodigoQR> actualizarCodigoQR(
            @RequestBody @Valid DatosActualizarCodigoQR datos) {
        DatosRespuestaCodigoQR respuesta = codigoQRService.actualizarCodigo(datos);
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCodigoQr(@PathVariable Long id) {
        codigoQRService.eliminarCodigoQr(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
