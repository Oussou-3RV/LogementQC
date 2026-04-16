package com.annonce.logique_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAnnonceRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 10, max = 200, message = "Le titre doit contenir entre 10 et 200 caractères")
    private String titre;

    @NotBlank(message = "La description courte est obligatoire")
    @Size(min = 20, max = 500, message = "La description courte doit contenir entre 20 et 500 caractères")
    private String descriptionCourte;

    @NotBlank(message = "La description longue est obligatoire")
    @Size(min = 50, message = "La description longue doit contenir au moins 50 caractères")
    private String descriptionLongue;

    @NotNull(message = "Le montant mensuel est obligatoire")
    @DecimalMin(value = "100.0", message = "Le montant minimum est 100$")
    private BigDecimal montantMensuel;

    @NotNull(message = "La date de disponibilité est obligatoire")
    @Future(message = "La date de disponibilité doit être dans le futur")
    private LocalDate dateDisponibilite;

    @NotNull(message = "Au moins une photo est requise")
    @Size(min = 1, message = "Au moins une photo est requise")
    private List<String> photos;

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

    private Double latitude;

    private Double longitude;
}