package com.example.demo.dto;

public class AuthResponse {
    private final String message;
    private final String token;
    private final String email;

    public AuthResponse(String message, String token, String email) {
        this.message = message;
        this.token = token;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }
}
