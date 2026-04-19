import { Injectable, signal } from '@angular/core';
import { MessageHttpService, MessageResponse, CreateMessageRequest } from './message-http.service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private receivedMessagesSignal = signal<MessageResponse[]>([]);
  private sentMessagesSignal = signal<MessageResponse[]>([]);
  private unreadMessagesSignal = signal<MessageResponse[]>([]);

  receivedMessages = this.receivedMessagesSignal.asReadonly();
  sentMessages = this.sentMessagesSignal.asReadonly();
  unreadMessages = this.unreadMessagesSignal.asReadonly();

  constructor(private messageHttp: MessageHttpService) {}

  sendMessage(messageData: CreateMessageRequest) {
    return this.messageHttp.createMessage(messageData).pipe(
      tap((newMessage) => {
        // Ajouter aux messages envoyés
        this.sentMessagesSignal.update(messages => [newMessage, ...messages]);
      }),
      catchError((error) => {
        console.error('Error sending message:', error);
        return throwError(() => error);
      })
    );
  }

  loadReceivedMessages() {
    return this.messageHttp.getReceivedMessages().pipe(
      tap((messages) => {
        this.receivedMessagesSignal.set(messages);
      }),
      catchError((error) => {
        console.error('Error loading received messages:', error);
        return throwError(() => error);
      })
    );
  }

  loadSentMessages() {
    return this.messageHttp.getSentMessages().pipe(
      tap((messages) => {
        this.sentMessagesSignal.set(messages);
      }),
      catchError((error) => {
        console.error('Error loading sent messages:', error);
        return throwError(() => error);
      })
    );
  }

  loadUnreadMessages() {
    return this.messageHttp.getUnreadMessages().pipe(
      tap((messages) => {
        this.unreadMessagesSignal.set(messages);
      }),
      catchError((error) => {
        console.error('Error loading unread messages:', error);
        return throwError(() => error);
      })
    );
  }

  markMessageAsRead(messageId: string) {
    return this.messageHttp.markAsRead(messageId).pipe(
      tap(() => {
        // Mettre à jour dans les listes
        this.receivedMessagesSignal.update(messages =>
          messages.map(m => m.id === messageId ? { ...m, lu: true } : m)
        );
        this.unreadMessagesSignal.update(messages =>
          messages.filter(m => m.id !== messageId)
        );
      }),
      catchError((error) => {
        console.error('Error marking message as read:', error);
        return throwError(() => error);
      })
    );
  }
}