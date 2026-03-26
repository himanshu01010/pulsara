package com.example.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.SignupRequest;
import com.example.demo.service.SignupService;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/auth")
public class SighnUp {
    private final SignupService ss;
    SighnUp(SignupService ss){
      this.ss=ss;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(ss.sighnup(request));
    }

}
