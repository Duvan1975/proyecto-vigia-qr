package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
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
    public ResponseEntity<?> registrarCodigosQR(
            @PathVariable Long idPuestosTrabajo,
            @RequestBody @Valid List<DatosRegistroCodigoQR> listaDatos
    ) {

        codigoQRService.registrarCodigosQR(idPuestosTrabajo, listaDatos);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Códigos QR registrados correctamente");
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
