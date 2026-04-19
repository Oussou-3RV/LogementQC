import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthHttpService, RegisterRequest, LoginRequest, AuthResponse, UpdateProfileRequest } from './auth-http.service';
import { catchError, tap, throwError } from 'rxjs';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  rue: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(
    private authHttp: AuthHttpService,
    private router: Router
  ) {
    // Vérifier si un token existe au démarrage
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    // Vérifier si on est dans le navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  register(registerData: RegisterRequest) {
    return this.authHttp.register(registerData).pipe(
      tap((response: AuthResponse) => {
        this.handleAuthSuccess(response);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  login(loginData: LoginRequest) {
    return this.authHttp.login(loginData).pipe(
      tap((response: AuthResponse) => {
        this.handleAuthSuccess(response);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string) {
    // TODO: Implémenter avec le backend
    return this.authHttp.getCurrentUser().pipe(
      tap(() => {
        console.log('Forgot password for:', email);
      })
    );
  }

  updateProfile(profileData: UpdateProfileRequest) {
    return this.authHttp.updateProfile(profileData).pipe(
      tap((updatedUser) => {
        // Mettre à jour le localStorage et le signal
        const currentUser = this.currentUserSignal();
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('current_user', JSON.stringify(newUser));
          }
          
          this.currentUserSignal.set(newUser);
        }
      }),
      catchError((error) => {
        console.error('Update profile error:', error);
        return throwError(() => error);
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Vérifier si on est dans le navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Stocker le token
    localStorage.setItem('auth_token', response.token);
    
    // Stocker l'utilisateur
    localStorage.setItem('current_user', JSON.stringify(response.user));
    
    // Mettre à jour les signals
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  logout(): void {
    // Vérifier si on est dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
    
    // Réinitialiser les signals
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/auth/login']);
  }

  getCurrentUserId(): string | null {
    const user = this.currentUserSignal();
    return user ? user.id : null;
  }
}