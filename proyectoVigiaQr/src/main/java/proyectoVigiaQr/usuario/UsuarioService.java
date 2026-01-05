package proyectoVigiaQr.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired UsuarioRepository usuarioRepository;

    public void registrarUsuario(DatosRegistroUsuario datos) {

        if (usuarioRepository.existsBynumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        usuarioRepository.save(new Usuario(datos));
    }
    public List<Usuario> listadoUsuarios() {
        return usuarioRepository.findAll();
    }
}
