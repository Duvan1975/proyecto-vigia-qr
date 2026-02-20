package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import proyectoVigiaQr.domain.usuario.DatosAutenticacionUsuario;
import proyectoVigiaQr.domain.usuario.Usuario;
import proyectoVigiaQr.infra.errores.security.TokenService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://proyecto-vigia-qr.vercel.app"
})
public class AutenticacionController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity autenticarUsuario(@RequestBody @Valid DatosAutenticacionUsuario datosAutenticacionUsuario) {
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                datosAutenticacionUsuario.username(),
                datosAutenticacionUsuario.password()
        );
        var usuarioAutenticado = authenticationManager.authenticate(authToken);
        var usuario = (Usuario) usuarioAutenticado.getPrincipal();

        // Verificar si el usuario está activo
        if (!usuario.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Cuenta desactivada. Contacte al administrador.");
        }

        var JWTtoken = tokenService.generarToken(usuario);

        // Devolver más información en la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("token", JWTtoken);
        response.put("rol", usuario.getRol().name());
        response.put("estado", usuario.isEnabled());
        response.put("administrador", usuario.getUsername());

        return ResponseEntity.ok(response);
    }
}
