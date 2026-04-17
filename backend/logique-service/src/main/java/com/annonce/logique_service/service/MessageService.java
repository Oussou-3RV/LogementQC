package com.annonce.logique_service.service;

import com.annonce.logique_service.dto.request.CreateMessageRequest;
import com.annonce.logique_service.dto.response.ApiMessageResponse;
import com.annonce.logique_service.dto.response.MessageResponse;
import com.annonce.logique_service.entity.Annonce;
import com.annonce.logique_service.entity.Message;
import com.annonce.logique_service.exception.ResourceNotFoundException;
import com.annonce.logique_service.repository.AnnonceRepository;
import com.annonce.logique_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final AnnonceRepository annonceRepository;

    @Transactional
    public MessageResponse createMessage(CreateMessageRequest request, String expediteurId) {
        log.info("Creating message from user {} for annonce {}", expediteurId, request.getAnnonceId());

        // Vérifier que l'annonce existe
        Annonce annonce = annonceRepository.findById(request.getAnnonceId())
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        // Le destinataire est le propriétaire de l'annonce
        String destinataireId = annonce.getUserId();

        // Vérifier que l'expéditeur n'est pas le destinataire
        if (expediteurId.equals(destinataireId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas vous envoyer un message à vous-même");
        }

        Message message = Message.builder()
                .annonceId(request.getAnnonceId())
                .expediteurId(expediteurId)
                .destinataireId(destinataireId)
                .sujet(request.getSujet())
                .contenu(request.getContenu())
                .lu(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Message created with id: {}", savedMessage.getId());

        return mapToMessageResponse(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getReceivedMessages(String userId) {
        log.info("Fetching received messages for user: {}", userId);
        return messageRepository.findByDestinataireIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getSentMessages(String userId) {
        log.info("Fetching sent messages for user: {}", userId);
        return messageRepository.findByExpediteurIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessages(String userId) {
        log.info("Fetching unread messages for user: {}", userId);
        return messageRepository.findByDestinataireIdAndLuFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByAnnonce(String annonceId) {
        log.info("Fetching messages for annonce: {}", annonceId);

        // Vérifier que l'annonce existe
        annonceRepository.findById(annonceId)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée"));

        return messageRepository.findByAnnonceIdOrderByCreatedAtDesc(annonceId).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiMessageResponse markAsRead(String messageId, String userId) {
        log.info("Marking message {} as read for user: {}", messageId, userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message non trouvé"));

        // Vérifier que l'utilisateur est le destinataire
        if (!message.getDestinataireId().equals(userId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à modifier ce message");
        }

        message.setLu(true);
        messageRepository.save(message);
        log.info("Message {} marked as read", messageId);

        return ApiMessageResponse.builder()
                .message("Message marqué comme lu")
                .build();
    }

    // Mapper Message -> MessageResponse
    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .annonceId(message.getAnnonceId())
                .expediteurId(message.getExpediteurId())
                .destinataireId(message.getDestinataireId())
                .sujet(message.getSujet())
                .contenu(message.getContenu())
                .lu(message.getLu())
                .createdAt(message.getCreatedAt())
                .build();
    }
}