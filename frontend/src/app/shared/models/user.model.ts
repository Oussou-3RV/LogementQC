export interface User {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: Adresse;
    password?: string; // Optionnel, ne sera pas retourné par le backend
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Adresse {
    rue: string;
    ville: string;
    province: string;
    codePostal: string;
    pays: string;
  }