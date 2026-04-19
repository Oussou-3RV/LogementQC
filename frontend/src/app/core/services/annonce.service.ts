import { Injectable, signal } from '@angular/core';
import { AnnonceHttpService, AnnonceResponse, CreateAnnonceRequest } from './annonce-http.service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private annoncesSignal = signal<AnnonceResponse[]>([]);
  private myAnnoncesSignal = signal<AnnonceResponse[]>([]);
  private selectedAnnonceSignal = signal<AnnonceResponse | null>(null);

  annonces = this.annoncesSignal.asReadonly();
  myAnnonces = this.myAnnoncesSignal.asReadonly();
  selectedAnnonce = this.selectedAnnonceSignal.asReadonly();

  constructor(private annonceHttp: AnnonceHttpService) {}

  loadActiveAnnonces() {
    return this.annonceHttp.getActiveAnnonces().pipe(
      tap((annonces) => {
        this.annoncesSignal.set(annonces);
      }),
      catchError((error) => {
        console.error('Error loading annonces:', error);
        return throwError(() => error);
      })
    );
  }

  loadMyAnnonces() {
    return this.annonceHttp.getMyAnnonces().pipe(
      tap((annonces) => {
        this.myAnnoncesSignal.set(annonces);
      }),
      catchError((error) => {
        console.error('Error loading my annonces:', error);
        return throwError(() => error);
      })
    );
  }

  loadAnnonceById(id: string) {
    return this.annonceHttp.getAnnonceById(id).pipe(
      tap((annonce) => {
        this.selectedAnnonceSignal.set(annonce);
      }),
      catchError((error) => {
        console.error('Error loading annonce:', error);
        return throwError(() => error);
      })
    );
  }

  searchAnnonces(query: string) {
    return this.annonceHttp.searchAnnonces(query).pipe(
      tap((annonces) => {
        this.annoncesSignal.set(annonces);
      }),
      catchError((error) => {
        console.error('Error searching annonces:', error);
        return throwError(() => error);
      })
    );
  }

  createAnnonce(annonceData: CreateAnnonceRequest) {
    return this.annonceHttp.createAnnonce(annonceData).pipe(
      tap((newAnnonce) => {
        // Ajouter à la liste des annonces
        this.annoncesSignal.update(annonces => [newAnnonce, ...annonces]);
        this.myAnnoncesSignal.update(annonces => [newAnnonce, ...annonces]);
      }),
      catchError((error) => {
        console.error('Error creating annonce:', error);
        return throwError(() => error);
      })
    );
  }

  updateAnnonce(id: string, annonceData: Partial<CreateAnnonceRequest>) {
    return this.annonceHttp.updateAnnonce(id, annonceData).pipe(
      tap((updatedAnnonce) => {
        // Mettre à jour dans les listes
        this.annoncesSignal.update(annonces =>
          annonces.map(a => a.id === id ? updatedAnnonce : a)
        );
        this.myAnnoncesSignal.update(annonces =>
          annonces.map(a => a.id === id ? updatedAnnonce : a)
        );
        this.selectedAnnonceSignal.set(updatedAnnonce);
      }),
      catchError((error) => {
        console.error('Error updating annonce:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAnnonce(id: string) {
    return this.annonceHttp.deleteAnnonce(id).pipe(
      tap(() => {
        // Retirer des listes
        this.annoncesSignal.update(annonces =>
          annonces.filter(a => a.id !== id)
        );
        this.myAnnoncesSignal.update(annonces =>
          annonces.filter(a => a.id !== id)
        );
      }),
      catchError((error) => {
        console.error('Error deleting annonce:', error);
        return throwError(() => error);
      })
    );
  }

  toggleAnnonceStatus(id: string) {
    return this.annonceHttp.toggleAnnonceStatus(id).pipe(
      tap((updatedAnnonce) => {
        // Mettre à jour dans les listes
        this.annoncesSignal.update(annonces =>
          annonces.map(a => a.id === id ? updatedAnnonce : a)
        );
        this.myAnnoncesSignal.update(annonces =>
          annonces.map(a => a.id === id ? updatedAnnonce : a)
        );
      }),
      catchError((error) => {
        console.error('Error toggling annonce status:', error);
        return throwError(() => error);
      })
    );
  }
}