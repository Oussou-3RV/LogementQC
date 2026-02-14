export interface Annonce {
    id?: string;
    titre: string;
    descriptionCourte: string;
    descriptionLongue: string;
    montantMensuel: number;
    dateDisponibilite: Date;
    photos: string[]; // URLs des photos
    adresse: AdresseLogement;
    userId: string; // ID de l'annonceur
    utilisateur?: User; // Infos de l'annonceur (optionnel)
    nombreConsultations: number;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface AdresseLogement {
    rue: string;
    ville: string;
    province: string;
    codePostal: string;
    pays: string;
    latitude?: number;  // Pour affichage sur carte
    longitude?: number;
  }
  
  import { User } from './user.model';