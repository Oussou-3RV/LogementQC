package com.annonce.auth_service.controller;

import com.annonce.auth_service.dto.request.ForgotPasswordRequest;
import com.annonce.auth_service.dto.request.LoginRequest;
import com.annonce.auth_service.dto.request.RegisterRequest;
import com.annonce.auth_service.dto.response.AuthResponse;
import com.annonce.auth_service.dto.response.MessageResponse;
import com.annonce.auth_service.dto.response.UserResponse;
import com.annonce.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Register new user");
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - User login");
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("POST /api/auth/forgot-password - Password reset request");
        MessageResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        log.info("GET /api/auth/me - Get current user");
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        UserResponse response = authService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<MessageResponse> health() {
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Auth service is running")
                .build());
    }
}