import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Annonce } from '@app/shared/models/annonce.model';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  
  // Utilisation de BehaviorSubject pour gérer les annonces de manière réactive
  private annoncesSubject = new BehaviorSubject<Annonce[]>([
    {
      id: '1',
      titre: 'Bel appartement 3½ au centre-ville',
      descriptionCourte: 'Appartement lumineux avec vue sur le fleuve',
      descriptionLongue: 'Magnifique appartement de 3½ pièces situé au cœur du centre-ville. Proche de tous les services, transport en commun à proximité. Cuisine moderne, salle de bain rénovée.',
      montantMensuel: 950,
      dateDisponibilite: new Date('2024-03-01'),
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      adresse: {
        rue: '123 Rue des Forges',
        ville: 'Trois-Rivières',
        province: 'QC',
        codePostal: 'G8Z 1T3',
        pays: 'Canada',
        latitude: 46.3432,
        longitude: -72.5477
      },
      userId: 'user1',
      nombreConsultations: 45,
      active: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      titre: 'Studio moderne meublé',
      descriptionCourte: 'Parfait pour étudiant ou professionnel',
      descriptionLongue: 'Studio entièrement meublé et équipé. Idéal pour étudiant UQTR ou jeune professionnel. Internet inclus, buanderie sur place.',
      montantMensuel: 675,
      dateDisponibilite: new Date('2024-02-15'),
      photos: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'
      ],
      adresse: {
        rue: '456 Boulevard des Récollets',
        ville: 'Trois-Rivières',
        province: 'QC',
        codePostal: 'G8Z 2B8',
        pays: 'Canada',
        latitude: 46.3456,
        longitude: -72.5489
      },
      userId: 'user2',
      nombreConsultations: 78,
      active: true,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      titre: 'Maison 4 chambres avec jardin',
      descriptionCourte: 'Idéale pour famille',
      descriptionLongue: 'Grande maison familiale avec 4 chambres, 2 salles de bain. Grand jardin clôturé, garage double, sous-sol aménagé. Quartier calme et sécuritaire.',
      montantMensuel: 1650,
      dateDisponibilite: new Date('2024-04-01'),
      photos: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
      ],
      adresse: {
        rue: '789 Rue Notre-Dame',
        ville: 'Trois-Rivières',
        province: 'QC',
        codePostal: 'G8Z 3K5',
        pays: 'Canada',
        latitude: 46.3512,
        longitude: -72.5423
      },
      userId: 'user1',
      nombreConsultations: 123,
      active: true,
      createdAt: new Date('2024-01-10')
    }
  ]);

  constructor() { }

  // Récupérer toutes les annonces actives
  getAnnonces(): Observable<Annonce[]> {
    return of(this.annoncesSubject.value.filter(a => a.active)).pipe(
      delay(500)
    );
  }

  // Récupérer une annonce par ID
  getAnnonceById(id: string): Observable<Annonce | undefined> {
    return of(this.annoncesSubject.value.find(a => a.id === id)).pipe(
      delay(300)
    );
  }

  // Rechercher des annonces
  searchAnnonces(query: string): Observable<Annonce[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.annoncesSubject.value.filter(a => 
      a.active && (
        a.titre.toLowerCase().includes(lowerQuery) ||
        a.descriptionCourte.toLowerCase().includes(lowerQuery) ||
        a.adresse.ville.toLowerCase().includes(lowerQuery)
      )
    );
    return of(results).pipe(delay(400));
  }

  // Créer une nouvelle annonce
  createAnnonce(annonce: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>): Observable<Annonce> {
    const newAnnonce: Annonce = {
      ...annonce,
      id: 'annonce-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ajouter au début de la liste
    const currentAnnonces = this.annoncesSubject.value;
    this.annoncesSubject.next([newAnnonce, ...currentAnnonces]);

    return of(newAnnonce).pipe(delay(1000));
  }

  // Récupérer les annonces d'un utilisateur spécifique
  getAnnoncesByUserId(userId: string): Observable<Annonce[]> {
    const userAnnonces = this.annoncesSubject.value.filter(a => a.userId === userId);
    return of(userAnnonces).pipe(delay(300));
  }

  // Mettre à jour une annonce
  updateAnnonce(id: string, updates: Partial<Annonce>): Observable<Annonce | undefined> {
    const currentAnnonces = this.annoncesSubject.value;
    const index = currentAnnonces.findIndex(a => a.id === id);
    
    if (index !== -1) {
      const updatedAnnonce = {
        ...currentAnnonces[index],
        ...updates,
        updatedAt: new Date()
      };
      currentAnnonces[index] = updatedAnnonce;
      this.annoncesSubject.next([...currentAnnonces]);
      return of(updatedAnnonce).pipe(delay(500));
    }
    
    return of(undefined).pipe(delay(500));
  }

  // Activer/Désactiver une annonce
  toggleAnnonceStatus(id: string): Observable<Annonce | undefined> {
    const currentAnnonces = this.annoncesSubject.value;
    const index = currentAnnonces.findIndex(a => a.id === id);
    
    if (index !== -1) {
      currentAnnonces[index].active = !currentAnnonces[index].active;
      currentAnnonces[index].updatedAt = new Date();
      this.annoncesSubject.next([...currentAnnonces]);
      return of(currentAnnonces[index]).pipe(delay(500));
    }
    
    return of(undefined).pipe(delay(500));
  }

  // Incrémenter le nombre de consultations
  incrementConsultations(id: string): void {
    const currentAnnonces = this.annoncesSubject.value;
    const annonce = currentAnnonces.find(a => a.id === id);
    if (annonce) {
      annonce.nombreConsultations++;
      this.annoncesSubject.next([...currentAnnonces]);
    }
  }
}