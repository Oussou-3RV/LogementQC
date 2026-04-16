package com.annonce.logique_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class UpdateAnnonceRequest {

    @Size(min = 10, max = 200, message = "Le titre doit contenir entre 10 et 200 caractères")
    private String titre;

    @Size(min = 20, max = 500, message = "La description courte doit contenir entre 20 et 500 caractères")
    private String descriptionCourte;

    @Size(min = 50, message = "La description longue doit contenir au moins 50 caractères")
    private String descriptionLongue;

    @DecimalMin(value = "100.0", message = "Le montant minimum est 100$")
    private BigDecimal montantMensuel;

    private LocalDate dateDisponibilite;

    private List<String> photos;

    private String rue;

    private String ville;

    private String province;

    @Pattern(regexp = "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$", message = "Format du code postal: A1A 1A1")
    private String codePostal;

    private String pays;

    private Double latitude;

    private Double longitude;

    private Boolean active;
}