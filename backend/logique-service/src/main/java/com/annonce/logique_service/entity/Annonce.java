package com.annonce.logique_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "annonces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Annonce {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titre;

    @Column(name = "description_courte", nullable = false, length = 500)
    private String descriptionCourte;

    @Column(name = "description_longue", nullable = false, columnDefinition = "TEXT")
    private String descriptionLongue;

    @Column(name = "montant_mensuel", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantMensuel;

    @Column(name = "date_disponibilite", nullable = false)
    private LocalDate dateDisponibilite;

    // Photos stockées comme JSON array de strings
    @Column(columnDefinition = "TEXT")
    private String photos;

    // Adresse du logement
    @Column(nullable = false)
    private String rue;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String province;

    @Column(name = "code_postal", nullable = false)
    private String codePostal;

    @Column(nullable = false)
    private String pays;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    // Référence à l'utilisateur (du microservice Auth)
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "nombre_consultations", nullable = false)
    private Integer nombreConsultations = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}