package com.annonce.auth_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class RegisterRequest {

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, message = "Le nom doit contenir au moins 2 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, message = "Le prénom doit contenir au moins 2 caractères")
    private String prenom;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^\\d{3}-\\d{3}-\\d{4}$", message = "Format du téléphone: 514-555-0123")
    private String telephone;

    @NotBlank(message = "La rue est obligatoire")
    private String rue;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @NotBlank(message = "La province est obligatoire")
    private String province;

    @NotBlank(message = "Le code postal est obligatoire")
    @Pattern(regexp = "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$", message = "Format du code postal: A1A 1A1")
    private String codePostal;

    @NotBlank(message = "Le pays est obligatoire")
    private String pays;
}