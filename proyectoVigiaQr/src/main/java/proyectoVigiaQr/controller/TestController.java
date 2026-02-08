package proyectoVigiaQr.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping("/admin")
    public String endpointAdmin() {
        return "Solo Administradores pueden ver esto";
    }

    @GetMapping("/oper")
    public String endopointOper() {
        return "Solo Operativos pueden ver esto";
    }

    @GetMapping("/public")
    public String endpointPublic() {
        return "Cualquiera puede ver esto sin autenticación";
    }
}
