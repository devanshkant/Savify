package com.example.savify_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Cross-Site Request Forgery)
                // This is strictly required for REST APIs, otherwise POST requests will always be blocked
                .csrf(csrf -> csrf.disable())

                // 2. Configure Route Permissions
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone to access the auth routes (Registration & Login)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Temporarily allow all other requests so you can build Phase 2 without friction
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}