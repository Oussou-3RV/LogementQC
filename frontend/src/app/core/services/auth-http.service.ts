import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  rue: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: {
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
  };
}

export interface UpdateProfileRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  rue?: string;
  ville?: string;
  province?: string;
  codePostal?: string;
  pays?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUrl = environment.apiAuthUrl;

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  updateProfile(request: UpdateProfileRequest): Observable<{ id: string; email: string; nom: string; prenom: string; telephone: string; rue: string; ville: string; province: string; codePostal: string; pays: string; }> {
    return this.http.put<any>(`${this.apiUrl}/profile`, request);
  }
  
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
}