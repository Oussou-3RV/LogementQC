package com.annonce.auth_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String rue;
    private String ville;
    private String province;
    private String codePostal;
    private String pays;
    private LocalDateTime createdAt;
}