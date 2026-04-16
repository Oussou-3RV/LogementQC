package com.annonce.logique_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String id;
    private String annonceId;
    private String expediteurId;
    private String destinataireId;
    private String sujet;
    private String contenu;
    private Boolean lu;
    private LocalDateTime createdAt;
}