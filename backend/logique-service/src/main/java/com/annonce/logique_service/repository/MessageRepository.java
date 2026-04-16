package com.annonce.logique_service.repository;

import com.annonce.logique_service.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    // Messages reçus par un utilisateur
    List<Message> findByDestinataireIdOrderByCreatedAtDesc(String destinataireId);

    // Messages envoyés par un utilisateur
    List<Message> findByExpediteurIdOrderByCreatedAtDesc(String expediteurId);

    // Messages non lus d'un utilisateur
    List<Message> findByDestinataireIdAndLuFalseOrderByCreatedAtDesc(String destinataireId);

    // Messages concernant une annonce
    List<Message> findByAnnonceIdOrderByCreatedAtDesc(String annonceId);

    // Messages d'une conversation (entre deux utilisateurs pour une annonce)
    List<Message> findByAnnonceIdAndExpediteurIdAndDestinataireIdOrderByCreatedAtAsc(
            String annonceId, String expediteurId, String destinataireId);
}