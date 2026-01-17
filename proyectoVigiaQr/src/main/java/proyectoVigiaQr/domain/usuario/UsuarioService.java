package proyectoVigiaQr.domain.usuario;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class UsuarioService {

    @Autowired UsuarioRepository usuarioRepository;

    public ResponseEntity<DatosRespuestaUsuario> registrarUsuario(
            DatosRegistroUsuario datos, UriComponentsBuilder uriComponentsBuilder) {

        if (usuarioRepository.existsBynumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        Usuario usuario = new Usuario(datos); //Creamos el objeto
        usuarioRepository.save(usuario); //Lo guardamos

        //Construímos la Uri del recurso creado
        var uri = uriComponentsBuilder.path("/usuarios/{id}").buildAndExpand(usuario.getId()).toUri();

        //Creamos la respuesta
        DatosRespuestaUsuario datosRespuestaUsuario = new DatosRespuestaUsuario(
                usuario.getId(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.isEstado()
        );
        return ResponseEntity.created(uri).body(datosRespuestaUsuario);
    }
    public Page<DatosListadoUsuario> listarUsuarios(Pageable paginacion) {
        return usuarioRepository.findAll(paginacion).map(DatosListadoUsuario::new);
    }

    public ResponseEntity<DatosRespuestaUsuario> obtenerDatosUsuario(Long id) {
        Usuario usuario = usuarioRepository.getReferenceById(id);
        var datosUsuario = new DatosRespuestaUsuario(
                usuario.getId(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.isEstado()
        );
        return ResponseEntity.ok(datosUsuario);
    }

    @Transactional
    public ResponseEntity actualizarUsuario(DatosActualizarUsuario datos) {
        Usuario usuario = usuarioRepository.getReferenceById(datos.id());
        usuario.actualizarDatos(datos);

        if (datos.nombres() != null) usuario.setNombres(datos.nombres());
        if (datos.apellidos() != null) usuario.setApellidos(datos.apellidos());
        if (datos.tipoDocumento() != null) usuario.setTipoDocumento(datos.tipoDocumento());
        if (datos.numeroDocumento() != null) usuario.setNumeroDocumento(datos.numeroDocumento());
        if (datos.username() != null) usuario.setUsername(datos.username());
        if (datos.password() != null) usuario.setPassword(datos.password());
        if (datos.rol() != null) usuario.setRol(datos.rol());
        if (datos.estado() != null) usuario.setEstado(datos.estado());

        return ResponseEntity.ok(new DatosRespuestaUsuario(
                usuario.getId(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.isEstado()
        ));
    }
    @Transactional
    public ResponseEntity cambiarEstadoUsuario(Long id) {
        Usuario usuario = usuarioRepository.getReferenceById(id);
        usuario.setEstado(!usuario.isEstado());
        return ResponseEntity.noContent().build();
    }
}
