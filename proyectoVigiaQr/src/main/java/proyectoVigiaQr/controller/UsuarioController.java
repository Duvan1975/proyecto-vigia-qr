package proyectoVigiaQr.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.usuario.DatosActualizarUsuario;
import proyectoVigiaQr.usuario.DatosListadoUsuario;
import proyectoVigiaQr.usuario.DatosRegistroUsuario;
import proyectoVigiaQr.usuario.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public void registrarUsuario(@RequestBody @Valid DatosRegistroUsuario datos) {
        System.out.println(datos);
        usuarioService.registrarUsuario(datos);
    }
    @GetMapping
    public Page<DatosListadoUsuario> listadoUsuarios(
            @PageableDefault(size = 20, sort = "apellidos")Pageable paginacion) {
        return usuarioService.listarUsuarios(paginacion);
    }
    @PutMapping
    public void actualizarUsuario(@RequestBody @Valid DatosActualizarUsuario datos) {
        usuarioService.actualizarUsuario(datos);
    }
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
    }
}
