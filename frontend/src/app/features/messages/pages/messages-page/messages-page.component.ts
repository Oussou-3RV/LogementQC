import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../../../core/services/message.service';
import { MessageResponse } from '../../../../core/services/message-http.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageListComponent } from '../../components/message-list/message-list.component';
import { ReplyMessageDialogComponent } from '../../components/reply-message-dialog/reply-message-dialog.component';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [
    CommonModule,
    MessageListComponent,
    ReplyMessageDialogComponent
  ],
  templateUrl: './messages-page.component.html',

})
export class MessagesPageComponent implements OnInit {
  receivedMessages: MessageResponse[] = [];
  sentMessages: MessageResponse[] = [];
  unreadMessages: MessageResponse[] = [];
  loading = true;
  selectedTab: 'received' | 'sent' | 'unread' = 'received';
  showReplyDialog = false;
  selectedMessage: MessageResponse | null = null;
 

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAuthenticated()) {
      this.showErrorToast('Vous devez être connecté');
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;

    this.messageService.loadReceivedMessages().subscribe({
      next: () => {
        this.receivedMessages = this.messageService.receivedMessages();
        this.checkSentMessages();
      },
      error: (err) => {
        console.error('Erreur chargement messages reçus:', err);
        this.loading = false;
      }
    });

    this.messageService.loadUnreadMessages().subscribe({
      next: () => {
        this.unreadMessages = this.messageService.unreadMessages();
      },
      error: (err) => {
        console.error('Erreur chargement non lus:', err);
      }
    });
  }

  private checkSentMessages(): void {
    this.messageService.loadSentMessages().subscribe({
      next: () => {
        this.sentMessages = this.messageService.sentMessages();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement messages envoyés:', err);
        this.loading = false;
      }
    });
  }

  onMarkAsRead(messageId: string): void {
    this.messageService.markMessageAsRead(messageId).subscribe({
      next: () => {
        this.showSuccessToast('Message marqué comme lu');
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erreur marquage lu:', err);
        this.showErrorToast('Erreur lors du marquage');
      }
    });
  }

  onReply(message: MessageResponse): void {
    this.selectedMessage = message;
    this.showReplyDialog = true;
  }

  closeReplyDialog(): void {
    this.showReplyDialog = false;
    this.selectedMessage = null;
  }

  sendReply(replyData: any): void {
    if (!this.selectedMessage) return;

    const messageData = {
      annonceId: replyData.annonceId,
      destinataireId: this.selectedMessage.expediteurId,
      sujet: replyData.sujet,
      contenu: replyData.contenu
    };

    this.messageService.sendMessage(messageData).subscribe({
      next: () => {
        this.showSuccessToast('Réponse envoyée avec succès !');
        this.closeReplyDialog();
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erreur envoi réponse:', err);
        this.showErrorToast('Erreur lors de l\'envoi de la réponse');
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  private showSuccessToast(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorToast(message: string): void {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all transform ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-100');
    }, 10);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}