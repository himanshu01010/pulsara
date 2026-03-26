package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.security.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    // 🔥 change this based on env (you can later use @Value)
    private final boolean isProd = true;

    // ✅ Common cookie creator
    private ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(isProd) // true in production
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite(isProd ? "None" : "Lax") // IMPORTANT
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest req,
                                        HttpServletResponse response) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );

        String email = authentication.getName();
        String token = jwtUtil.generateToken(email);

        // ✅ Set cookie
        ResponseCookie jwtCookie = createJwtCookie(token);
        response.setHeader("Set-Cookie", jwtCookie.toString());

        return ResponseEntity.ok("Login successful");
    }

    // 🔥 Logout
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(isProd)
                .path("/")
                .maxAge(0)
                .sameSite(isProd ? "None" : "Lax")
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public ResponseEntity<String> me(Authentication auth) {
        return ResponseEntity.ok(auth.getName());
    }
}