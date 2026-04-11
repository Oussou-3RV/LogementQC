package com.annonce.auth_service.service;

import com.annonce.auth_service.dto.request.ForgotPasswordRequest;
import com.annonce.auth_service.dto.request.LoginRequest;
import com.annonce.auth_service.dto.request.RegisterRequest;
import com.annonce.auth_service.dto.response.AuthResponse;
import com.annonce.auth_service.dto.response.MessageResponse;
import com.annonce.auth_service.dto.response.UserResponse;
import com.annonce.auth_service.entity.User;
import com.annonce.auth_service.exception.InvalidCredentialsException;
import com.annonce.auth_service.exception.UserAlreadyExistsException;
import com.annonce.auth_service.exception.UserNotFoundException;
import com.annonce.auth_service.repository.UserRepository;
import com.annonce.auth_service.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;


    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Un utilisateur avec cet email existe déjà");
        }

        // Créer le nouvel utilisateur
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .rue(request.getRue())
                .ville(request.getVille())
                .province(request.getProvince())
                .codePostal(request.getCodePostal())
                .pays(request.getPays())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());

        // Générer le token JWT
        String token = jwtUtils.generateToken(savedUser.getEmail());

        // Construire la réponse
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting to login user with email: {}", request.getEmail());

        try {
            // Authentifier l'utilisateur
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Récupérer l'utilisateur
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

            // Générer le token JWT
            String token = jwtUtils.generateToken(user.getEmail());

            log.info("User logged in successfully: {}", user.getEmail());

            // Construire la réponse
            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .user(mapToUserResponse(user))
                    .build();

        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }
    }

    @Transactional(readOnly = true)
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());

        // Vérifier que l'utilisateur existe
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Aucun compte associé à cet email"));

        // TODO: Implémenter l'envoi d'email avec token de réinitialisation
        // Pour le Jalon II, on simule juste l'envoi
        log.info("Password reset email would be sent to: {}", user.getEmail());

        return MessageResponse.builder()
                .message("Un email de réinitialisation a été envoyé à " + request.getEmail())
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        return mapToUserResponse(user);
    }

    // Mapper User -> UserResponse
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .telephone(user.getTelephone())
                .rue(user.getRue())
                .ville(user.getVille())
                .province(user.getProvince())
                .codePostal(user.getCodePostal())
                .pays(user.getPays())
                .createdAt(user.getCreatedAt())
                .build();
    }
}