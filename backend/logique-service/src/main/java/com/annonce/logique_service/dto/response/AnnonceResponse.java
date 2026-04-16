package com.annonce.logique_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnonceResponse {
    private String id;
    private String titre;
    private String descriptionCourte;
    private String descriptionLongue;
    private BigDecimal montantMensuel;
    private LocalDate dateDisponibilite;
    private List<String> photos;
    private AdresseResponse adresse;
    private String userId;
    private Integer nombreConsultations;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}