package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// Vaqtinchalik foydalanuvchini bazaga avtomatik qo'shish uchun
	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String email = "azizbekd146@gmail.com";
			if (userRepository.findByEmail(email).isEmpty()) {
				User tempUser = new User();
				tempUser.setName("Azizbek (Admin)");
				tempUser.setEmail(email);
				// Parolni shifrlab saqlaymiz
				tempUser.setPassword(passwordEncoder.encode("parol12345"));
				userRepository.save(tempUser);
				System.out.println("====== VAQTINCHALIK FOYDALANUVCHI BAZAGA YARATILDI (SHIFRLANGAN PAROL BILAN) ======");
				System.out.println("Email: " + email);
			}
		};
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*") // Frontend manzili uchun ruxsat
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
			}
		};
	}
}