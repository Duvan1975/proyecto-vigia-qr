package proyectoVigiaQr.infra;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class TratadorDeErrores {

    /*@ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity tratarError404(){
        return ResponseEntity.notFound().build();
    }*/

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> tratarError404(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("error", e.getMessage())
        );
    }

    //De esta forma le indicamos al usuario cual fue el error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity tratarError400(MethodArgumentNotValidException e){
        var errores = e.getFieldErrors().stream().map(DatosErrorValidacion::new).toList();
        return ResponseEntity.badRequest().body(errores);
    }

    // Solución simple y práctica
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity tratarErrorEnum(HttpMessageNotReadableException e){
        List<Map<String, String>> errores = new ArrayList<>();
        Map<String, String> error = new HashMap<>();

        // Extraer el nombre del campo del enum del mensaje de error
        String campo = "campo no identificado";
        if (e.getMessage() != null && e.getMessage().contains("not one of the values accepted for Enum class")) {
            // Extraer nombre del enum del mensaje
            String[] partes = e.getMessage().split("`");
            if (partes.length > 1) {
                String[] enumPartes = partes[1].split("\\.");
                campo = enumPartes[enumPartes.length - 1];
            }
        }

        error.put("campo", campo.toLowerCase()); // Convertir a minúsculas para consistencia
        error.put("error", "Por favor, seleccione una opción válida en el campo " + campo);

        errores.add(error);
        return ResponseEntity.badRequest().body(errores);
    }

    //Creamos un DTO para darle tratamiento a esos errores capturando los mensajes
    private record DatosErrorValidacion(String campo, String error){
        public DatosErrorValidacion(FieldError error){
            this(error.getField(), error.getDefaultMessage());
        }
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity tratarErrorRuntime(RuntimeException e){
        return ResponseEntity.badRequest().body(new DatosErrorGeneral(e.getMessage()));
    }

    //Creamos el DTO para tratar este error

    private record DatosErrorGeneral(String error){}

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> tratarError400(IllegalStateException e) {
        return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
        );
    }
}
