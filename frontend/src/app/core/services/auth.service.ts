import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Récupérer l'utilisateur du localStorage si existe (seulement côté navigateur)
    let storedUser = null;
    if (this.isBrowser) {
      const userJson = localStorage.getItem('currentUser');
      storedUser = userJson ? JSON.parse(userJson) : null;
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Login (mock pour Jalon I)
  login(email: string, password: string): Observable<User> {
    // Simulation d'un utilisateur connecté
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: email,
      nom: 'Doe',
      prenom: 'John',
      telephone: '514-555-0123',
      adresse: {
        rue: '123 Rue Example',
        ville: 'Montréal',
        province: 'QC',
        codePostal: 'H1A 1A1',
        pays: 'Canada'
      },
      createdAt: new Date()
    };

    // Stocker dans localStorage (seulement côté navigateur)
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }
    this.currentUserSubject.next(mockUser);

    return of(mockUser).pipe(delay(1000)); // Simule un délai réseau
  }

  // Register (mock pour Jalon I)
  register(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };

    // Auto-login après inscription (seulement côté navigateur)
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
    this.currentUserSubject.next(newUser);

    return of(newUser).pipe(delay(1000));
  }

  // Logout
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  // Forgot password (mock pour Jalon I)
  forgotPassword(email: string): Observable<{ message: string }> {
    console.log('Reset password email sent to:', email);
    return of({ message: 'Email de réinitialisation envoyé' }).pipe(delay(1000));
  }

  // Update profile
  updateProfile(user: User): Observable<User> {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    return of(user).pipe(delay(500));
  }
}