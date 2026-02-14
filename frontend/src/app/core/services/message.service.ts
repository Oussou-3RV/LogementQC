import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Message } from '../../shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private mockMessages: Message[] = [];

  constructor() { }

  // Envoyer un message (pour l'instant on simule juste)
  sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'lu'>): Observable<Message> {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      lu: false,
      createdAt: new Date()
    };
    
    this.mockMessages.push(newMessage);
    
    console.log('Message envoyé (mock):', newMessage);
    return of(newMessage).pipe(delay(500));
  }

  // Récupérer les messages d'un utilisateur
  getMessagesByUser(userId: string): Observable<Message[]> {
    const messages = this.mockMessages.filter(
      m => m.expediteurId === userId || m.destinataireId === userId
    );
    return of(messages).pipe(delay(300));
  }

  private generateId(): string {
    return 'msg_' + Math.random().toString(36).substr(2, 9);
  }
}