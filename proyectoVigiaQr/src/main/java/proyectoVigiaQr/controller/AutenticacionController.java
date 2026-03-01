package proyectoVigiaQr.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public ResponseEntity<?> autenticarUsuario(
            @RequestBody @Valid DatosAutenticacionUsuario datos) {

        try {

            Authentication authToken =
                    new UsernamePasswordAuthenticationToken(
                            datos.username(),
                            datos.password()
                    );

            var usuarioAutenticado =
                    authenticationManager.authenticate(authToken);

            var usuario = (Usuario) usuarioAutenticado.getPrincipal();

            var JWTtoken = tokenService.generarToken(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("token", JWTtoken);
            response.put("rol", usuario.getRol().name());
            response.put("estado", usuario.isEnabled());
            response.put("usuario", usuario.getNombres());

            return ResponseEntity.ok(response);

        } catch (DisabledException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error",
                            "Tu cuenta está desactivada. Contacta al administrador."));

        } catch (BadCredentialsException | UsernameNotFoundException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error",
                            "Usuario o contraseña incorrectos."));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Error interno del servidor. Intenta más tarde."));
        }
    }
}
