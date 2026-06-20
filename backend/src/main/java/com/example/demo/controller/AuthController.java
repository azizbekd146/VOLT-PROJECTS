package com.example.demo.controller; // <-- XATOLIK SHU YERDA EDI: .controller qo'shildi!

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
// Vercel'dan keladigan so'rovlar bloklanmasligi uchun CORS ruxsati qo'shildi:
@CrossOrigin(origins = "https://volt-projects.vercel.app", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. RO'YXATDAN O'TISH -> Manzil: http://localhost:8080/api/register
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
        user.setPassword(password);

        userRepository.save(user);

        System.out.println("====== BAZAGA YANGI FOYDALANUVCHI YOZILDI ======");
        System.out.println("Email: " + cleanEmail);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Tizimga kiring."));
    }

    // 2. TIZIMGA KIRISH -> Manzil: http://localhost:8080/api/login
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
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Foydalanuvchi topilmadi! Oldin ro'yxatdan o'ting."));
        }

        User user = userOpt.get();

        if (user.getPassword().equals(password)) {
            System.out.println("====== FOYDALANUVCHI TIZIMGA KIRDI ======");
            System.out.println("Email: " + cleanEmail);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Xush kelibsiz, " + user.getName() + "!",
                    "name", user.getName(),
                    "email", user.getEmail() // React localStorage'ga saqlashi uchun emailni ham qaytardik
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Parol noto'g'ri!"));
        }
    }
}