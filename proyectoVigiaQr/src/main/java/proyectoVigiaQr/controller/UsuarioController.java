package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigiaQr.domain.usuario.*;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService usuarioService;

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {

        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<DatosRespuestaUsuario> registrarUsuario(
            @RequestBody @Valid DatosRegistroUsuario datos,
            UriComponentsBuilder uriComponentsBuilder) {
        return usuarioService.registrarUsuario(datos, uriComponentsBuilder);
    }
    @GetMapping
    public Page<DatosListadoUsuario> listadoUsuarios(
            @PageableDefault(size = 20, sort = "apellidos")Pageable paginacion) {
        return usuarioService.listarUsuarios(paginacion);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DatosRespuestaUsuario> obtenerDatosUsuario(@PathVariable Long id) {
        return usuarioService.obtenerDatosUsuario(id);
    }
    @PutMapping
    public ResponseEntity<DatosRespuestaUsuario> actualizarUsuario(
            @RequestBody @Valid DatosActualizarUsuario datos) {
        // Solo llamar una vez al servicio
        return usuarioService.actualizarUsuario(datos);
    }
    @PatchMapping("/{id}/estado")
    public ResponseEntity cambiarEstado(@PathVariable Long id) {
        return usuarioService.cambiarEstadoUsuario(id);

    }
    /*@GetMapping("/buscarPorNombre")
    public ResponseEntity<List<DatosRespuestaUsuario>> buscarPorNombre(
            @RequestParam String nombres) {
        List<Usuario> usuarios = usuarioRepository.findByNombresContainingIgnoreCase(nombres);
        List<DatosRespuestaUsuario> resultado = usuarios.stream()
                .map(u -> new DatosRespuestaUsuario(
                    u.getId(),
                        u.getNombres(),
                        u.getApellidos(),
                        u.getTipoDocumento(),
                        u.getNumeroDocumento(),
                        u.getUsername(),
                        u.getRol(),
                        u.isEstado()
                )).toList();
        return ResponseEntity.ok(resultado);
    }*/

    @GetMapping("buscarPorNombreCompleto")
    public ResponseEntity<List<DatosRespuestaUsuario>> buscarPorNombreCompleto(
            @RequestParam String filtro) {
        return usuarioService.buscarUsuarioNombreCompleto(filtro);
    }

    @GetMapping("/buscarPorDocumento")
    public ResponseEntity<List<DatosRespuestaUsuario>> buscarPorDocumento(
            @RequestParam String numeroDocumento) {

       return usuarioService.buscarPorNumeroDocumento(numeroDocumento);

    }

}
