
package com.emmzy.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class CsrfController {

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        // Accessing the token causes Spring Security to resolve it.
        String token = csrfToken.getToken();

        return Map.of(
                "token", token,
                "headerName", csrfToken.getHeaderName()
        );
    }
}
