export interface Message {
    id?: string;
    annonceId: string;
    expediteurId: string; // User intéressé
    destinataireId: string; // Annonceur
    sujet: string;
    contenu: string;
    lu: boolean;
    createdAt?: Date;
  }
  
  export interface MessageDetail extends Message {
    annonce?: Annonce;
    expediteur?: User;
    destinataire?: User;
  }
  
  import { Annonce } from './annonce.model';
  import { User } from './user.model';