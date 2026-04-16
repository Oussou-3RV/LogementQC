package com.annonce.logique_service.repository;

import com.annonce.logique_service.entity.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, String> {

    // Trouver toutes les annonces actives
    List<Annonce> findByActiveTrue();

    // Trouver les annonces d'un utilisateur
    List<Annonce> findByUserId(String userId);

    // Trouver les annonces actives d'un utilisateur
    List<Annonce> findByUserIdAndActiveTrue(String userId);

    // Rechercher des annonces par ville
    List<Annonce> findByVilleContainingIgnoreCaseAndActiveTrue(String ville);

    // Rechercher des annonces par titre ou description
    @Query("SELECT a FROM Annonce a WHERE a.active = true AND " +
            "(LOWER(a.titre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.descriptionCourte) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.ville) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Annonce> searchAnnonces(@Param("query") String query);
}