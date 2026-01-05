package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.usuario.DatosRegistroUsuario;
import proyectoVigiaQr.usuario.Usuario;
import proyectoVigiaQr.usuario.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
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
    public List<Usuario> listadoUsuarios() {
        return usuarioService.listadoUsuarios();
    }
}
