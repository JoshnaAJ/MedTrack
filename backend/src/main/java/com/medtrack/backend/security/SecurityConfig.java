package com.medtrack.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .antMatchers(
                    "/", 
                    "/index.html", 
                    "/login.html", 
                    "/register.html", 
                    "/dashboard.html",
                    "/style.css", 
                    "/script.js",
                    "/**/*.css", 
                    "/**/*.js", 
                    "/images/**", 
                    "/static/**",
                    "/api/auth/**", 
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().authenticated()
            .and()
            .headers().frameOptions().disable(); // Allow H2 console

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
