package com.annonce.logique_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdresseResponse {
    private String rue;
    private String ville;
    private String province;
    private String codePostal;
    private String pays;
    private Double latitude;
    private Double longitude;
}