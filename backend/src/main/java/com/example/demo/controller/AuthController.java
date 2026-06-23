package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = {
                "https://volt-projects.vercel.app",
                "http://localhost:5173",
                "http://localhost:5174"
        },
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. RO'YXATDAN O'TISH
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");

        if (email == null || email.trim().isEmpty() ||
                password == null || password.trim().isEmpty() ||
                name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Barcha maydonlarni to'ldirish shart!"));
        }

        String cleanEmail = email.trim().toLowerCase();

        if (userRepository.findByEmail(cleanEmail).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Bu email allaqachon ro'yxatdan o'tgan!"));
        }

        User user = new User();
        user.setName(name.trim());
        user.setEmail(cleanEmail);
        // Parolni shifrlab saqlaymiz
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);

        System.out.println("====== BAZAGA YANGI FOYDALANUVCHI YOZILDI (SHIFRLANGAN PAROL BILAN) ======");
        System.out.println("Email: " + cleanEmail);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Tizimga kiring."));
    }

    // 2. TIZIMGA KIRISH
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Email va parol kiritilishi shart!"));
        }

        String cleanEmail = email.trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Foydalanuvchi topilmadi! Oldin ro'yxatdan o'teng."));
        }

        User user = userOpt.get();

        // Kiritilgan parol bilan bazadagi shifrlangan parolni solishtiramiz
        if (passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("====== FOYDALANUVCHI TIZIMGA KIRDI ======");
            System.out.println("Email: " + cleanEmail);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Xush kelibsiz, " + user.getName() + "!",
                    "name", user.getName(),
                    "email", user.getEmail()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Email yoki parol noto'g'ri!"));
        }
    }
}