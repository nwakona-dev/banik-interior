
package com.emmzy.config;

import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {

    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {

        CookieCsrfTokenRepository repository =
                CookieCsrfTokenRepository.withHttpOnlyFalse();

        repository.setCookieCustomizer(cookie -> cookie
                .sameSite("None")
                .secure(true)
                .path("/")
        );

        return repository;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CookieCsrfTokenRepository csrfTokenRepository,
            SecurityContextRepository securityContextRepository
    ) throws Exception {

        http

                // Enable CORS.
                .cors(cors -> {})

                // Keep CSRF protection enabled.
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository)
                        .csrfTokenRequestHandler(
                                new CsrfTokenRequestAttributeHandler()
                        )
                )

                // Configure session-based authentication.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                // Explicitly save and load authentication from the session.
                .securityContext(context -> context
                        .securityContextRepository(securityContextRepository)
                )

                // Configure endpoint permissions.
                .authorizeHttpRequests(auth -> auth

                        // Allow error dispatches.
                        .dispatcherTypeMatchers(
                                DispatcherType.ERROR
                        ).permitAll()

                        // Allow CORS preflight requests.
                        .requestMatchers(
                                HttpMethod.OPTIONS, "/**"
                        ).permitAll()

                        // PUBLIC: Customers can browse products.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products",
                                "/api/products/**"
                        ).permitAll()

                        // PUBLIC: Product images.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/uploads/products/**"
                        ).permitAll()

                        // PUBLIC: Authentication and CSRF endpoints.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/csrf",
                                "/api/auth/me"
                        ).permitAll()

                        // PUBLIC: Login and initial admin setup.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/setup",
                                "/api/auth/login"
                        ).permitAll()

                        // ADMIN ONLY: Product management.
                        .requestMatchers(
                                "/api/products",
                                "/api/products/**",
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Protect all remaining endpoints.
                        .anyRequest().authenticated()
                )

                // Disable default authentication mechanisms.
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
