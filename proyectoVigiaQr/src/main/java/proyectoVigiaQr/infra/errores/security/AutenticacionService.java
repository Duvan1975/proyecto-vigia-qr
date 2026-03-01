package proyectoVigiaQr.infra.errores.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import proyectoVigiaQr.domain.usuario.Rol;
import proyectoVigiaQr.domain.usuario.TipoDocumento;
import proyectoVigiaQr.domain.usuario.Usuario;
import proyectoVigiaQr.domain.usuario.UsuarioRepository;

@Service
public class AutenticacionService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void crearUsuariosDePrueba() {
        //Solo crear si no existen
        if (usuarioRepository.findByUsername("admin@test.com") == null) {
            var admin = new Usuario();
            admin.setUsername("admin@test.com");
            admin.setPassword(passwordEncoder.encode("12345"));
            admin.setRol(Rol.ADMINISTRATIVO);
            admin.setNombres("NOMBRE DE PRUEBA 1");
            admin.setApellidos("APELLIDO DE PRUEBA 1");
            admin.setTipoDocumento(TipoDocumento.CE);
            admin.setNumeroDocumento("45893215");
            //admin.setEstado(admin.isEstado());
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByUsername("oper@test.com") == null) {
            var oper = new Usuario();
            oper.setUsername("oper@test.com");
            oper.setPassword(passwordEncoder.encode("12345"));
            oper.setRol(Rol.OPERATIVO);
            oper.setNombres("NOMBRE DE PRUEBA 1");
            oper.setApellidos("APELLIDO DE PRUEBA 1");
            oper.setTipoDocumento(TipoDocumento.PASAPORTE);
            oper.setNumeroDocumento("89784565");
            //oper.setEstado(oper.isEstado());
            usuarioRepository.save(oper);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        var usuario = usuarioRepository.findByUsername(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario o contraseña incorrectos");
        }

        return usuario;
    }
}
