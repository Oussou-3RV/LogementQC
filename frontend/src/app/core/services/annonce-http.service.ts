import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateAnnonceRequest {
  descriptionCourte: string;
  descriptionLongue: string;
  montantMensuel: number;
  dateDisponibilite: string;
  rue: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
  photos: string[];
}

export interface AnnonceResponse {
  id: string;
  titre: string;
  descriptionCourte: string;
  descriptionLongue: string;
  montantMensuel: number;
  dateDisponibilite: string;
  photos: string[];
  adresse: {
    rue: string;
    ville: string;
    province: string;
    codePostal: string;
    pays: string;
    latitude?: number;
    longitude?: number;
  };
  userId: string;
  nombreConsultations: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnonceHttpService {
  private apiUrl = environment.apiLogiqueUrl;

  constructor(private http: HttpClient) {}

  // Créer une annonce
  createAnnonce(request: CreateAnnonceRequest): Observable<AnnonceResponse> {
    return this.http.post<AnnonceResponse>(`${this.apiUrl}/annonces`, request);
  }

  // Récupérer toutes les annonces actives
  getActiveAnnonces(): Observable<AnnonceResponse[]> {
    return this.http.get<AnnonceResponse[]>(`${this.apiUrl}/annonces/active`);
  }

  // Récupérer une annonce par ID
  getAnnonceById(id: string): Observable<AnnonceResponse> {
    return this.http.get<AnnonceResponse>(`${this.apiUrl}/annonces/${id}`);
  }

  // Récupérer mes annonces
  getMyAnnonces(): Observable<AnnonceResponse[]> {
    return this.http.get<AnnonceResponse[]>(`${this.apiUrl}/annonces/user/me`);
  }

  // Rechercher des annonces
  searchAnnonces(query: string): Observable<AnnonceResponse[]> {
    return this.http.get<AnnonceResponse[]>(`${this.apiUrl}/annonces/search?q=${query}`);
  }

  // Modifier une annonce
  updateAnnonce(id: string, request: Partial<CreateAnnonceRequest>): Observable<AnnonceResponse> {
    return this.http.put<AnnonceResponse>(`${this.apiUrl}/annonces/${id}`, request);
  }

  // Supprimer une annonce
  deleteAnnonce(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/annonces/${id}`);
  }

  // Toggle statut
  toggleAnnonceStatus(id: string): Observable<AnnonceResponse> {
    return this.http.patch<AnnonceResponse>(`${this.apiUrl}/annonces/${id}/toggle`, {});
  }
}