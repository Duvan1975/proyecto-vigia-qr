package proyectoVigiaQr.puestosTrabajo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PuestosTrabajoService {

    @Autowired
    private PuestosTrabajoRepository puestosTrabajoRepository;

    public PuestosTrabajo registrarPuestoTrabajo(DatosRegistroPuestos datos) {
        return puestosTrabajoRepository.save(new PuestosTrabajo(datos));
    }

}
