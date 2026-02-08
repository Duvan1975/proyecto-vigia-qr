package proyectoVigiaQr.domain.usuario;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Transactional
    public ResponseEntity<DatosRespuestaUsuario> registrarUsuario(
            @Valid DatosRegistroUsuario datos, UriComponentsBuilder uriComponentsBuilder) {

        if (usuarioRepository.existsBynumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }

        //Creamos un objeto desde el DTO
        Usuario usuario = new Usuario(datos);

        //Encriptamos el password antes de guardar
        String passwordEncriptada = passwordEncoder.encode(datos.password());
        usuario.setPassword(passwordEncriptada);

        //Guardamos en la DB
        usuarioRepository.save(usuario);

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
    public ResponseEntity<DatosRespuestaUsuario> actualizarUsuario(DatosActualizarUsuario datos) {
        Usuario usuario = usuarioRepository.getReferenceById(datos.id());

        // Validar si el número de documento ya existe para otro usuario
        if (datos.numeroDocumento() != null && !datos.numeroDocumento().equals(usuario.getNumeroDocumento())) {
            // Verificar si el nuevo número de documento ya existe en otro usuario (excluyendo el actual)
            boolean existeDocumentoEnOtroUsuario = usuarioRepository.existsByNumeroDocumentoAndIdNot(
                    datos.numeroDocumento(),
                    datos.id()
            );

            if (existeDocumentoEnOtroUsuario) {
                throw new RuntimeException("Número de documento ya está en uso por otro usuario");
            }

            if (datos.nombres() != null && !datos.nombres().isBlank()) {
                usuario.setNombres(datos.nombres().trim());
            }

            if (datos.apellidos() != null && !datos.apellidos().isBlank()) {
                usuario.setApellidos(datos.apellidos().trim());
            }
        }
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

    // Método para quitar acentos
    private String quitarTildes(String texto) {
        String textoNormalizado = Normalizer.normalize(texto, Normalizer.Form.NFD);
        Pattern patron = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return patron.matcher(textoNormalizado).replaceAll("");
    }

    public ResponseEntity<List<DatosRespuestaUsuario>> buscarUsuarioNombreCompleto(String filtro) {
        String filtroLimpio = quitarTildes(filtro.toLowerCase());

        var palabras = filtroLimpio.split("\\s+");

        // Usamos solo la primera palabra para prefiltrar en BD
        var usuarios = usuarioRepository.buscarUsuarioNombreCompleto(palabras[0]);

        var usuariosFiltrados = usuarios.stream()
                .filter(usuario -> {
                    String nombreCompleto = quitarTildes((usuario.getNombres() + " " + usuario.getApellidos()).toLowerCase());
                    return Arrays.stream(palabras).allMatch(nombreCompleto::contains);
                })
                .map(usuario -> new DatosRespuestaUsuario(
                        usuario.getId(),
                        usuario.getNombres(),
                        usuario.getApellidos(),
                        usuario.getTipoDocumento(),
                        usuario.getNumeroDocumento(),
                        usuario.getUsername(),
                        usuario.getRol(),
                        usuario.isEstado()
                ))
                .toList();
        return ResponseEntity.ok(usuariosFiltrados);
    }

    public ResponseEntity<List<DatosRespuestaUsuario>> buscarPorNumeroDocumento(String numeroDocumento) {
        var usuarios = usuarioRepository.findByNumeroDocumento(numeroDocumento);

        if (usuarios.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.emptyList());
        }
        var resultado = usuarios.stream()
                .map(usuario -> new DatosRespuestaUsuario(
                        usuario.getId(),
                        usuario.getNombres(),
                        usuario.getApellidos(),
                        usuario.getTipoDocumento(),
                        usuario.getNumeroDocumento(),
                        usuario.getUsername(),
                        usuario.getRol(),
                        usuario.isEstado()
                )).toList();
        return ResponseEntity.ok(resultado);
    }

}
