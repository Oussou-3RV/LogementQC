package com.annonce.logique_service.controller;

import com.annonce.logique_service.dto.request.CreateAnnonceRequest;
import com.annonce.logique_service.dto.request.UpdateAnnonceRequest;
import com.annonce.logique_service.dto.response.AnnonceResponse;
import com.annonce.logique_service.dto.response.ApiMessageResponse;
import com.annonce.logique_service.service.AnnonceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annonces")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AnnonceController {

    private final AnnonceService annonceService;

    @PostMapping
    public ResponseEntity<AnnonceResponse> createAnnonce(
            @Valid @RequestBody CreateAnnonceRequest request,
            Authentication authentication) {
        log.info("POST /api/annonces - Create new annonce");
        String userId = (String) authentication.getCredentials();
        AnnonceResponse response = annonceService.createAnnonce(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AnnonceResponse>> getAllActiveAnnonces() {
        log.info("GET /api/annonces/active - Get all active annonces");
        List<AnnonceResponse> response = annonceService.getAllActiveAnnonces();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/me")
    public ResponseEntity<List<AnnonceResponse>> getMyAnnonces(Authentication authentication) {
        log.info("GET /api/annonces/user/me - Get current user's annonces");
        String userId = (String) authentication.getCredentials();
        List<AnnonceResponse> response = annonceService.getAnnoncesByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnonceResponse> getAnnonceById(@PathVariable String id) {
        log.info("GET /api/annonces/{} - Get annonce by id", id);
        AnnonceResponse response = annonceService.getAnnonceById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnonceResponse> updateAnnonce(
            @PathVariable String id,
            @Valid @RequestBody UpdateAnnonceRequest request,
            Authentication authentication) {
        log.info("PUT /api/annonces/{} - Update annonce", id);
        String userId = (String) authentication.getCredentials();
        AnnonceResponse response = annonceService.updateAnnonce(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiMessageResponse> deleteAnnonce(
            @PathVariable String id,
            Authentication authentication) {
        log.info("DELETE /api/annonces/{} - Delete annonce", id);
        String userId = (String) authentication.getCredentials();
        annonceService.deleteAnnonce(id, userId);
        return ResponseEntity.ok(ApiMessageResponse.builder()
                .message("Annonce supprimée avec succès")
                .build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<AnnonceResponse> toggleAnnonceStatus(
            @PathVariable String id,
            Authentication authentication) {
        log.info("PATCH /api/annonces/{}/toggle - Toggle annonce status", id);
        String userId = (String) authentication.getCredentials();
        AnnonceResponse response = annonceService.toggleAnnonceStatus(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AnnonceResponse>> searchAnnonces(@RequestParam String q) {
        log.info("GET /api/annonces/search?q={} - Search annonces", q);
        List<AnnonceResponse> response = annonceService.searchAnnonces(q);
        return ResponseEntity.ok(response);
    }
}