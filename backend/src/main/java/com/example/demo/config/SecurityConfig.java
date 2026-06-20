package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // login va register manzillariga hamma kira oladi
                        .requestMatchers("/", "/error", "/api/login", "/api/register").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // DIQQAT: Google muvaffaqiyatli o'tganda shu yer ishlaydi
                        .successHandler((request, response, authentication) -> {
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

                            // Googledan ism va emailni olamiz
                            String email = oAuth2User.getAttribute("email");
                            String name = oAuth2User.getAttribute("name");

                            // Bo'shliqlarni xavfsiz URL ko'rinishiga keltiramiz
                            String safeName = java.net.URLEncoder.encode(name, "UTF-8");

                            // Foydalanuvchini frontenddagi register sahifasiga ma'lumotlari bilan qayta yo'naltiramiz
                            response.sendRedirect("http://localhost:5173?email=" + email + "&name=" + safeName);
                        })
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}