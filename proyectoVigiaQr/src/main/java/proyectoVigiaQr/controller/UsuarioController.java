package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigiaQr.usuario.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
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
    public ResponseEntity actualizarUsuario(
            @RequestBody @Valid DatosActualizarUsuario datos) {
        usuarioService.actualizarUsuario(datos);
        return usuarioService.actualizarUsuario(datos);
    }
    @PatchMapping("/{id}/estado")
    public ResponseEntity cambiarEstado(@PathVariable Long id) {
        return usuarioService.cambiarEstadoUsuario(id);
    }
}
