package proyectoVigiaQr;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import proyectoVigiaQr.infra.errores.security.AutenticacionService;

@SpringBootApplication
public class SoftwareDeRegistroQrApplication {

	public static void main(String[] args) {

		SpringApplication.run(SoftwareDeRegistroQrApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(AutenticacionService autenticacionService) {
		return args -> {
			autenticacionService.crearUsuariosDePrueba();
		};
	}

}
