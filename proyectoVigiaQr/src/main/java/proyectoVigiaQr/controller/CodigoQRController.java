package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.codigosQR.CodigoQRService;
import proyectoVigiaQr.codigosQR.DatosListadoCodigoQR;
import proyectoVigiaQr.codigosQR.DatosRegistroCodigoQR;

import java.util.List;

@RestController
@RequestMapping("/codigos-qr")
@CrossOrigin(origins = "http://localhost:3000")
public class CodigoQRController {

    private final CodigoQRService codigoQRService;

    public CodigoQRController(CodigoQRService codigoQRService) {
        this.codigoQRService = codigoQRService;
    }

    @PostMapping
    public ResponseEntity<Void> registrarCodigoQR(
            @RequestBody @Valid DatosRegistroCodigoQR datos
    ) {
        codigoQRService.registrarCodigoQR(datos);
        return ResponseEntity.status(HttpStatus.CREATED).build();

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

}
