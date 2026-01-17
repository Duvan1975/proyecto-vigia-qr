package proyectoVigiaQr.puestosTrabajo;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class PuestosTrabajoService {

    @Autowired
    private PuestosTrabajoRepository puestosTrabajoRepository;

    public ResponseEntity<DatosRespuestaPuestoTrabajo> registrarPuestoTrabajo(
            DatosRegistroPuestos datos, UriComponentsBuilder uriComponentsBuilder) {

        PuestosTrabajo puestosTrabajo = new PuestosTrabajo(datos); //Creamos el objeto
        puestosTrabajoRepository.save(puestosTrabajo); //Lo guardamos

        //Construímos la Uri del recurso creado
        var uri = uriComponentsBuilder.path("puestosTrabajos/{id}").buildAndExpand(puestosTrabajo.getId()).toUri();

        //Creamos la respuesta
        DatosRespuestaPuestoTrabajo datosRespuestaPuestoTrabajo = new DatosRespuestaPuestoTrabajo(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );
        return ResponseEntity.created(uri).body(datosRespuestaPuestoTrabajo);

    }
    public Page<DatosListadoPuestos> listarPuestosTrabajo(Pageable paginacion) {
        return puestosTrabajoRepository.findAll(paginacion).map(DatosListadoPuestos::new);
    }
    public ResponseEntity<DatosRespuestaPuestoTrabajo> obtenerDatosPuesto(Long id) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(id);
        var datosPuesto = new DatosRespuestaPuestoTrabajo(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        );
        return ResponseEntity.ok(datosPuesto);
    }
    @Transactional
    public ResponseEntity actualizarPuestoTrabajo(DatosActualizarPuesto datos) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(datos.id());
        puestosTrabajo.actualizarDatos(datos);

        if (datos.nombrePuesto() != null) puestosTrabajo.setNombrePuesto(datos.nombrePuesto());
        if (datos.descripcion() != null) puestosTrabajo.setDescripcion(datos.descripcion());
        if (datos.direccion() != null) puestosTrabajo.setDireccion(datos.direccion());
        if (datos.estado() != null) puestosTrabajo.setEstado(datos.estado());

        return ResponseEntity.ok(new DatosRespuestaPuestoTrabajo(
                puestosTrabajo.getId(),
                puestosTrabajo.getNombrePuesto(),
                puestosTrabajo.getDescripcion(),
                puestosTrabajo.getDireccion(),
                puestosTrabajo.isEstado()
        ));

    }
    @Transactional
    public ResponseEntity cambiarEstadoPuesto(Long id) {
        PuestosTrabajo puestosTrabajo = puestosTrabajoRepository.getReferenceById(id);
        puestosTrabajo.setEstado(!puestosTrabajo.isEstado());
        return ResponseEntity.noContent().build();
    }

}
