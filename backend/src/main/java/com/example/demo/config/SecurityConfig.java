package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource; // BU QATOR QO'SHILDI
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Parollarni shifrlash uchun Bean yaratamiz
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Barcha kerakli yo'llarga, shu jumladan Google OAuth2 uchun ham ruxsat beramiz
                        .requestMatchers("/", "/error", "/api/login", "/api/register", "/oauth2/**", "/login/**").permitAll()
                        // Qolgan barcha so'rovlar autentifikatsiya talab qiladi
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // Muvaffaqiyatli kirishdan so'ng /success manziliga yo'naltirish
                        .defaultSuccessUrl("/success", true)
                        // Xatolik yuz berganda login sahifasiga xabar bilan qaytarish
                        .failureUrl("/login?google-error=true")
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Frontend manzillarini to'liq kiritish
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "https://volt-projects.vercel.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}