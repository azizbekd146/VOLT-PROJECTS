package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@RestController
public class HomeController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String home() {
        return "Backend ishlamoqda! Tizimga kirish uchun: /oauth2/authorization/google";
    }

    @GetMapping("/success")
    public RedirectView success(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return new RedirectView("https://volt-projects.vercel.app/login?error=AuthenticationFailed");
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        if (email == null || email.trim().isEmpty()) {
            return new RedirectView("https://volt-projects.vercel.app/login?error=EmailNotFound");
        }

        String cleanEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            System.out.println("====== GOOGLE ORQALI TIZIMGA KIRDI (OAuth2) ======");
        } else {
            user = new User();
            user.setName(name != null ? name.trim() : "Google User");
            user.setEmail(cleanEmail);
            user.setPassword("oauth2_user_" + System.currentTimeMillis()); // Parol kerak emas, lekin maydon bo'sh bo'lmasligi kerak
            userRepository.save(user);
            System.out.println("====== GOOGLE ORQALI YANGI FOYDALANUVCHI YARATILDI (OAuth2) ======");
        }
        System.out.println("Email: " + cleanEmail);

        try {
            String encodedName = URLEncoder.encode(user.getName(), StandardCharsets.UTF_8.toString());
            String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8.toString());
            // Muvaffaqiyatli kirishdan so'ng frontendning asosiy sahifasiga yo'naltirish
            return new RedirectView("https://volt-projects.vercel.app/dashboard?name=" + encodedName + "&email=" + encodedEmail);
        } catch (UnsupportedEncodingException e) {
            // Bu xatolik deyarli yuz bermaydi
            return new RedirectView("https://volt-projects.vercel.app/login?error=EncodingError");
        }
    }
}