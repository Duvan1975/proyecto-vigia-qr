package proyectoVigiaQr.domain.codigosQR;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import proyectoVigiaQr.domain.puestosTrabajo.PuestosTrabajo;
import proyectoVigiaQr.domain.puestosTrabajo.PuestosTrabajoRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class CodigoQRService {

    private final CodigoQRRepository codigoQRRepository;
    private final PuestosTrabajoRepository puestosTrabajoRepository;

    public CodigoQRService(CodigoQRRepository codigoQRRepository,
                           PuestosTrabajoRepository puestosTrabajoRepository) {

        this.codigoQRRepository = codigoQRRepository;
        this.puestosTrabajoRepository = puestosTrabajoRepository;
    }

    @Transactional
    public void registrarCodigosQR(
            Long idPuestosTrabajo,
            List<DatosRegistroCodigoQR> listaDatos
    ) {

        PuestosTrabajo puesto = puestosTrabajoRepository.findById(idPuestosTrabajo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El puesto de trabajo no existe"
                ));

        List<CodigoQR> codigosQR = listaDatos.stream().map(datos -> {

            boolean existeQrActivo = codigoQRRepository
                    .existsByUbicacionAndPuestosTrabajoIdAndEstadoTrue(
                            datos.ubicacion(),
                            puesto.getId()
                    );

            if (existeQrActivo) {
                throw new IllegalStateException(
                        "Ya existe un código QR activo para la ubicación: "
                                + datos.ubicacion()
                );
            }

            return new CodigoQR(
                    datos.descripcion(),
                    datos.ubicacion(),
                    puesto
            );

        }).toList();

        codigoQRRepository.saveAll(codigosQR);
    }

    public List<DatosListadoCodigoQR> listarPorPuesto(Long idPuestosTrabajo) {

        return codigoQRRepository.findByPuestosTrabajoId(idPuestosTrabajo)
                .stream()
                .map(DatosListadoCodigoQR::new)
                .toList();
    }
    //Servicio de generación del QR
    public byte[] generarImagenQr(Long idCodigoQr) {

        CodigoQR codigoQR = codigoQRRepository.findById(idCodigoQr)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Código QR no encontrado"
                ));

        if (!codigoQR.isEstado()) {
            throw new IllegalArgumentException(
                    "El código QR está inactivo"
            );
        }

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                    codigoQR.getValorQr(),
                    BarcodeFormat.QR_CODE,
                    300,
                    300
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error al generar el código QR", e);
        }
    }
}
