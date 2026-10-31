package com.emmzy.controller;

import com.emmzy.payload.AuthResponse;
import com.emmzy.dto.LoginRequest;
import com.emmzy.dto.RegisterRequest;
import com.emmzy.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register the first admin
    @PostMapping("/setup")
    public ResponseEntity<AuthResponse> registerFirstAdmin(
            @RequestBody RegisterRequest request
    ) {
        try {
            authService.registerFirstAdmin(
                    request.username(),
                    request.email(),
                    request.password()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new AuthResponse(
                            "Admin account created successfully.",
                            request.username(),
                            false
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse(
                            e.getMessage(),
                            null,
                            false
                    ));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(
                            e.getMessage(),
                            null,
                            false
                    ));
        }
    }

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        try {
            authService.login(
                    request.username(),
                    request.password(),
                    httpRequest,
                    httpResponse
            );

            Authentication authentication =
                    SecurityContextHolder.getContext().getAuthentication();

            return ResponseEntity.ok(
                    new AuthResponse(
                            "Login successful.",
                            authentication.getName(),
                            true
                    )
            );

        } catch (AuthenticationException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid username or password.",
                            null,
                            false
                    ));
        }
    }

    // Admin logout
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(
            HttpServletRequest request
    ) {
        authService.logout(request);

        return ResponseEntity.ok(
                new AuthResponse(
                        "Logout successful.",
                        null,
                        false
                )
        );
    }

    // Check the current session
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> currentAdmin() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Not authenticated.",
                            null,
                            false
                    ));
        }

        return ResponseEntity.ok(
                new AuthResponse(
                        "Authenticated.",
                        authentication.getName(),
                        true
                )
        );
    }
}
