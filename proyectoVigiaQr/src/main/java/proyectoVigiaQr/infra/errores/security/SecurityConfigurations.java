package proyectoVigiaQr.infra.errores.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of(
                            "http://localhost:3000",
                            "http://localhost:8080",
                            "https://proyecto-vigia-qr.vercel.app"
                    ));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        //Endpoint públicos
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/test/public").permitAll()

                        // ==================== RONDAS ====================
                        // Escritura - Todos autenticados
                        .requestMatchers(HttpMethod.POST, "/rondas").authenticated()

                        // ==================== PUESTOS DE TRABAJO ====================
                        //Escritura y lectura solo ADMINISTRATIVO
                        .requestMatchers(HttpMethod.POST, "/puestosTrabajos").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PUT, "/puestosTrabajos/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.GET, "/puestosTrabajos").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/puestosTrabajos/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PATCH, "/puestosTrabajos/**").hasAuthority("ROLE_ADMINISTRATIVO")

                        // ==================== CÓDIGOS QR ====================
                        //Escritura y lectura solo ADMINISTRATIVO
                        .requestMatchers(HttpMethod.POST, "/codigos-qr").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PUT, "/codigos-qr/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.GET, "/codigos-qr").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/codigos-qr/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PATCH, "/codigos-qr/**").hasAuthority("ROLE_ADMINISTRATIVO")

                        // ==================== RONDAS ====================
                        //Escritura y lectura solo ADMINISTRATIVO
                        .requestMatchers(HttpMethod.POST, "/rondas").hasAnyAuthority("ROLE_ADMINISTRATIVO", "ROLE_OPERATIVO")
                        .requestMatchers(HttpMethod.PUT, "/rondas/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.GET, "/rondas").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/rondas/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PATCH, "/rondas/**").hasAuthority("ROLE_ADMINISTRATIVO")

                        // ==================== USUARIOS ====================
                        //Escritura y lectura solo ADMINISTRATIVO
                        .requestMatchers(HttpMethod.POST, "/usuarios").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.GET, "/usuarios").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**").hasAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/**").hasAuthority("ROLE_ADMINISTRATIVO")

                        //Protección por ROLES Usuarios de prueba
                        .requestMatchers("/test/admin/**").hasAnyAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers("/test/oper/**").hasAnyAuthority("ROLE_ADMINISTRATIVO", "ROLE_OPERATIVO")

                        //Protección por ROLES Usuarios REALES (endpoints)
                        .requestMatchers("/usuarios/**").hasAnyAuthority("ROLE_ADMINISTRATIVO")
                        .requestMatchers("/puestosTrabajos/**").hasAnyAuthority("ROLE_ADMINISTRATIVO", "ROLE_OPERATIVO")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
        throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
