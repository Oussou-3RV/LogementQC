package com.annonce.auth_service.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @Size(min = 2, message = "Le nom doit contenir au moins 2 caractères")
    private String nom;

    @Size(min = 2, message = "Le prénom doit contenir au moins 2 caractères")
    private String prenom;

    @Pattern(regexp = "^\\d{3}-\\d{3}-\\d{4}$", message = "Format du téléphone: 514-555-0123")
    private String telephone;

    private String rue;

    private String ville;

    private String province;

    @Pattern(regexp = "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$", message = "Format du code postal: A1A 1A1")
    private String codePostal;

    private String pays;
}