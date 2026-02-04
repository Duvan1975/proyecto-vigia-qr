package proyectoVigiaQr.infra.errores.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import proyectoVigiaQr.domain.usuario.Usuario;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.secret}")
    private String apiSecret;

    public String generarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);
            return JWT.create()
                    .withIssuer("database")
                    .withSubject(usuario.getUsername())
                    .withClaim("id", usuario.getId())
                    .withExpiresAt(generarFechaExpiracion())
                    .sign(algorithm);
        } catch (
                JWTCreationException exception) {
            throw new RuntimeException("¡Error! al generar el token", exception);
        }
    }
    public String getSubject (String token) {

        try{
            Algorithm algorithm = Algorithm.HMAC256(apiSecret);
            DecodedJWT verifier = JWT.require(algorithm)

                    .withIssuer("database")
                    .build()
                    .verify(token);
            return verifier.getSubject();//Retorna el subject correctamente
        }catch (JWTVerificationException exception){
            throw new RuntimeException("El token enviado NO es válido" + exception);
        }
    }
    private Instant generarFechaExpiracion(){
        return LocalDateTime.now().plusHours(2)
                .toInstant(ZoneOffset.of("-05:00"));
    }
}
