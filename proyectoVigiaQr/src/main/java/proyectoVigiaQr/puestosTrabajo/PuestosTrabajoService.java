package proyectoVigiaQr.puestosTrabajo;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PuestosTrabajoService {

    @Autowired
    private PuestosTrabajoRepository puestosTrabajoRepository;

    public PuestosTrabajo registrarPuestoTrabajo(DatosRegistroPuestos datos) {
        return puestosTrabajoRepository.save(new PuestosTrabajo(datos));
    }
    public Page<DatosListadoPuestos> listarPuestosTrabajo(Pageable paginacion) {
        return puestosTrabajoRepository.findAll(paginacion).map(DatosListadoPuestos::new);
    }
    @Transactional
    public void actualizarPuestoTrabajo(DatosActualizarPuesto datos) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(datos.id());
        if (datos.nombrePuesto() != null) puestosTrabajo.setNombrePuesto(datos.nombrePuesto());
        if (datos.descripcion() != null) puestosTrabajo.setDescripcion(datos.descripcion());
        if (datos.direccion() != null) puestosTrabajo.setDireccion(datos.direccion());
        if (datos.estado() != null) puestosTrabajo.setEstado(datos.estado());

    }
    @Transactional
    public void eliminarPuestoTrabajo(Long id) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(id);
        puestosTrabajo.setEstado(false);
    }

}
