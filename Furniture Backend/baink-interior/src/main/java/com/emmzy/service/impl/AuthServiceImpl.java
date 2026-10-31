
package com.emmzy.service.impl;

import com.emmzy.model.Admin;
import com.emmzy.repository.AdminRepository;
import com.emmzy.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @Override
    @Transactional
    public void registerFirstAdmin(
            String username,
            String email,
            String password
    ) {
        if (adminRepository.count() > 0) {
            throw new IllegalStateException(
                    "Admin registration is closed."
            );
        }

        if (username == null || username.isBlank()
                || email == null || email.isBlank()
                || password == null || password.length() < 12) {
            throw new IllegalArgumentException(
                    "Provide a username, email, and password of at least 12 characters."
            );
        }

        // Normalize username to lowercase.
        String normalizedUsername = username.trim().toLowerCase(Locale.ROOT);

        if (adminRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException(
                    "Username is already taken."
            );
        }

        if (adminRepository.existsByEmail(email.trim())) {
            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }

        Admin admin = new Admin();
        admin.setUsername(normalizedUsername);
        admin.setEmail(email.trim());
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ROLE_ADMIN");

        adminRepository.save(admin);
    }

    @Override
    public void login(
            String username,
            String password,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Make username login case-insensitive.
        String normalizedUsername = username.trim().toLowerCase(Locale.ROOT);

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                normalizedUsername,
                                password
                        )
                );

        // Prevent session fixation by rotating the session ID.
        HttpSession session = request.getSession(true);
        request.changeSessionId();

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(
                context,
                request,
                response
        );
    }

    @Override
    public void logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }
    }
}
