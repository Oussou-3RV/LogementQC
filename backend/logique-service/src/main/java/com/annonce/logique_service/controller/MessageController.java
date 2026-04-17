package com.annonce.logique_service.controller;

import com.annonce.logique_service.dto.request.CreateMessageRequest;
import com.annonce.logique_service.dto.response.ApiMessageResponse;
import com.annonce.logique_service.dto.response.MessageResponse;
import com.annonce.logique_service.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> createMessage(
            @Valid @RequestBody CreateMessageRequest request,
            Authentication authentication) {
        log.info("POST /api/messages - Create new message");
        String expediteurId = (String) authentication.getCredentials();
        MessageResponse response = messageService.createMessage(request, expediteurId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/received")
    public ResponseEntity<List<MessageResponse>> getReceivedMessages(Authentication authentication) {
        log.info("GET /api/messages/received - Get received messages");
        String userId = (String) authentication.getCredentials();
        List<MessageResponse> response = messageService.getReceivedMessages(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MessageResponse>> getSentMessages(Authentication authentication) {
        log.info("GET /api/messages/sent - Get sent messages");
        String userId = (String) authentication.getCredentials();
        List<MessageResponse> response = messageService.getSentMessages(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages(Authentication authentication) {
        log.info("GET /api/messages/unread - Get unread messages");
        String userId = (String) authentication.getCredentials();
        List<MessageResponse> response = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/annonce/{annonceId}")
    public ResponseEntity<List<MessageResponse>> getMessagesByAnnonce(@PathVariable String annonceId) {
        log.info("GET /api/messages/annonce/{} - Get messages for annonce", annonceId);
        List<MessageResponse> response = messageService.getMessagesByAnnonce(annonceId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<ApiMessageResponse> markAsRead(
            @PathVariable String id,
            Authentication authentication) {
        log.info("PATCH /api/messages/{}/mark-read - Mark message as read", id);
        String userId = (String) authentication.getCredentials();
        ApiMessageResponse response = messageService.markAsRead(id, userId);
        return ResponseEntity.ok(response);
    }
}