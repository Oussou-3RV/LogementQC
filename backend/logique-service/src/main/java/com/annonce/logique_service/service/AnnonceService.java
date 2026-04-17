package com.annonce.logique_service.service;

import com.annonce.logique_service.dto.request.CreateAnnonceRequest;
import com.annonce.logique_service.dto.request.UpdateAnnonceRequest;
import com.annonce.logique_service.dto.response.AdresseResponse;
import com.annonce.logique_service.dto.response.AnnonceResponse;
import com.annonce.logique_service.entity.Annonce;
import com.annonce.logique_service.exception.ResourceNotFoundException;
import com.annonce.logique_service.exception.UnauthorizedAccessException;
import com.annonce.logique_service.repository.AnnonceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnonceService {

    private final AnnonceRepository annonceRepository;
    private final ObjectMapper objectMapper ;

    @Transactional
    public AnnonceResponse createAnnonce(CreateAnnonceRequest request, String userId) {
        log.info("Creating annonce for user: {}", userId);

        // Convertir la liste de photos en JSON string
        String photosJson = convertPhotosToJson(request.getPhotos());

        Annonce annonce = Annonce.builder()
                .titre(request.getTitre())
                .descriptionCourte(request.getDescriptionCourte())
                .descriptionLongue(request.getDescriptionLongue())
                .montantMensuel(request.getMontantMensuel())
                .dateDisponibilite(request.getDateDisponibilite())
                .photos(photosJson)
                .rue(request.getRue())
                .ville(request.getVille())
                .province(request.getProvince())
                .codePostal(request.getCodePostal())
                .pays(request.getPays())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .userId(userId)
                .nombreConsultations(0)
                .active(true)
                .build();

        Annonce savedAnnonce = annonceRepository.save(annonce);
        log.info("Annonce created with id: {}", savedAnnonce.getId());

        return mapToAnnonceResponse(savedAnnonce);
    }

    @Transactional(readOnly = true)
    public List<AnnonceResponse> getAllActiveAnnonces() {
        log.info("Fetching all active annonces");
        return annonceRepository.findByActiveTrue().stream()
                .map(this::mapToAnnonceResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnonceResponse> getAnnoncesByUserId(String userId) {
        log.info("Fetching annonces for user: {}", userId);
        return annonceRepository.findByUserId(userId).stream()
                .map(this::mapToAnnonceResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnnonceResponse getAnnonceById(String id) {
        log.info("Fetching annonce with id: {}", id);
        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        // Incrémenter le nombre de consultations
        annonce.setNombreConsultations(annonce.getNombreConsultations() + 1);
        annonceRepository.save(annonce);

        return mapToAnnonceResponse(annonce);
    }

    @Transactional
    public AnnonceResponse updateAnnonce(String id, UpdateAnnonceRequest request, String userId) {
        log.info("Updating annonce {} for user: {}", id, userId);

        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!annonce.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        // Mise à jour des champs si présents
        if (request.getTitre() != null) {
            annonce.setTitre(request.getTitre());
        }
        if (request.getDescriptionCourte() != null) {
            annonce.setDescriptionCourte(request.getDescriptionCourte());
        }
        if (request.getDescriptionLongue() != null) {
            annonce.setDescriptionLongue(request.getDescriptionLongue());
        }
        if (request.getMontantMensuel() != null) {
            annonce.setMontantMensuel(request.getMontantMensuel());
        }
        if (request.getDateDisponibilite() != null) {
            annonce.setDateDisponibilite(request.getDateDisponibilite());
        }
        if (request.getPhotos() != null) {
            annonce.setPhotos(convertPhotosToJson(request.getPhotos()));
        }
        if (request.getRue() != null) {
            annonce.setRue(request.getRue());
        }
        if (request.getVille() != null) {
            annonce.setVille(request.getVille());
        }
        if (request.getProvince() != null) {
            annonce.setProvince(request.getProvince());
        }
        if (request.getCodePostal() != null) {
            annonce.setCodePostal(request.getCodePostal());
        }
        if (request.getPays() != null) {
            annonce.setPays(request.getPays());
        }
        if (request.getLatitude() != null) {
            annonce.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            annonce.setLongitude(request.getLongitude());
        }
        if (request.getActive() != null) {
            annonce.setActive(request.getActive());
        }

        Annonce updatedAnnonce = annonceRepository.save(annonce);
        log.info("Annonce updated: {}", updatedAnnonce.getId());

        return mapToAnnonceResponse(updatedAnnonce);
    }

    @Transactional
    public void deleteAnnonce(String id, String userId) {
        log.info("Deleting annonce {} for user: {}", id, userId);

        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!annonce.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à supprimer cette annonce");
        }

        annonceRepository.delete(annonce);
        log.info("Annonce deleted: {}", id);
    }

    @Transactional
    public AnnonceResponse toggleAnnonceStatus(String id, String userId) {
        log.info("Toggling status for annonce {} by user: {}", id, userId);

        Annonce annonce = annonceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!annonce.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        annonce.setActive(!annonce.getActive());
        Annonce updatedAnnonce = annonceRepository.save(annonce);
        log.info("Annonce status toggled: {} -> {}", id, updatedAnnonce.getActive());

        return mapToAnnonceResponse(updatedAnnonce);
    }

    @Transactional(readOnly = true)
    public List<AnnonceResponse> searchAnnonces(String query) {
        log.info("Searching annonces with query: {}", query);
        return annonceRepository.searchAnnonces(query).stream()
                .map(this::mapToAnnonceResponse)
                .collect(Collectors.toList());
    }

    // Convertir liste de photos en JSON
    private String convertPhotosToJson(List<String> photos) {
        try {
            return objectMapper.writeValueAsString(photos);
        } catch (JsonProcessingException e) {
            log.error("Error converting photos to JSON", e);
            return "[]";
        }
    }

    // Convertir JSON en liste de photos
    private List<String> convertJsonToPhotos(String photosJson) {
        try {
            return objectMapper.readValue(photosJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON to photos", e);
            return List.of();
        }
    }

    // Mapper Annonce -> AnnonceResponse
    private AnnonceResponse mapToAnnonceResponse(Annonce annonce) {
        return AnnonceResponse.builder()
                .id(annonce.getId())
                .titre(annonce.getTitre())
                .descriptionCourte(annonce.getDescriptionCourte())
                .descriptionLongue(annonce.getDescriptionLongue())
                .montantMensuel(annonce.getMontantMensuel())
                .dateDisponibilite(annonce.getDateDisponibilite())
                .photos(convertJsonToPhotos(annonce.getPhotos()))
                .adresse(AdresseResponse.builder()
                        .rue(annonce.getRue())
                        .ville(annonce.getVille())
                        .province(annonce.getProvince())
                        .codePostal(annonce.getCodePostal())
                        .pays(annonce.getPays())
                        .latitude(annonce.getLatitude())
                        .longitude(annonce.getLongitude())
                        .build())
                .userId(annonce.getUserId())
                .nombreConsultations(annonce.getNombreConsultations())
                .active(annonce.getActive())
                .createdAt(annonce.getCreatedAt())
                .updatedAt(annonce.getUpdatedAt())
                .build();
    }
}