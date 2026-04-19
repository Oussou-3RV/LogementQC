import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface CreateMessageRequest {
  annonceId: string;
  sujet: string;
  contenu: string;
}

export interface MessageResponse {
  id: string;
  annonceId: string;
  expediteurId: string;
  destinataireId: string;
  sujet: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageHttpService {
  private apiUrl = environment.apiLogiqueUrl;

  constructor(private http: HttpClient) {}

  createMessage(request: CreateMessageRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/messages`, request);
  }

  getReceivedMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.apiUrl}/messages/received`);
  }

  getSentMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.apiUrl}/messages/sent`);
  }

  getUnreadMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.apiUrl}/messages/unread`);
  }

  markAsRead(messageId: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/messages/${messageId}/mark-read`, {});
  }
}