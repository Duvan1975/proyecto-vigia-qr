package proyectoVigiaQr.usuario;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired UsuarioRepository usuarioRepository;

    public void registrarUsuario(DatosRegistroUsuario datos) {

        if (usuarioRepository.existsBynumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        usuarioRepository.save(new Usuario(datos));
    }
    public Page<DatosListadoUsuario> listarUsuarios(Pageable paginacion) {
        return usuarioRepository.findAll(paginacion).map(DatosListadoUsuario::new);
    }
    @Transactional
    public void actualizarUsuario(DatosActualizarUsuario datos) {
        Usuario usuario = usuarioRepository.getReferenceById(datos.id());
        if (datos.nombres() != null) usuario.setNombres(datos.nombres());
        if (datos.apellidos() != null) usuario.setApellidos(datos.apellidos());
        if (datos.tipoDocumento() != null) usuario.setTipoDocumento(datos.tipoDocumento());
        if (datos.numeroDocumento() != null) usuario.setNumeroDocumento(datos.numeroDocumento());
        if (datos.username() != null) usuario.setUsername(datos.username());
        if (datos.password() != null) usuario.setPassword(datos.password());
        if (datos.rol() != null) usuario.setRol(datos.rol());
        if (datos.estado() != null) usuario.setEstado(datos.estado());
    }
    @Transactional
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.getReferenceById(id);
        usuario.setEstado(false);
    }
}
