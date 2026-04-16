package com.annonce.logique_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMessageRequest {

    @NotBlank(message = "L'ID de l'annonce est obligatoire")
    private String annonceId;

    @NotBlank(message = "Le sujet est obligatoire")
    @Size(min = 5, max = 200, message = "Le sujet doit contenir entre 5 et 200 caractères")
    private String sujet;

    @NotBlank(message = "Le contenu est obligatoire")
    @Size(min = 20, message = "Le contenu doit contenir au moins 20 caractères")
    private String contenu;
}