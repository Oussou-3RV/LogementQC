import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from '../../../../core/services/message.service';
import { MessageResponse } from '../../../../core/services/message-http.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageListComponent } from "../../components/message-list/message-list.component"
import { MatDialog } from '@angular/material/dialog';
import { ReplyMessageDialogComponent } from '../../components/reply-message-dialog/reply-message-dialog.component';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MessageListComponent
  ],
  templateUrl: './messages-page.component.html',
})
export class MessagesPageComponent implements OnInit {
  receivedMessages: MessageResponse[] = [];
  sentMessages: MessageResponse[] = [];
  unreadMessages: MessageResponse[] = [];
  loading = true;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Vérifier si connecté
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Vous devez être connecté', 'Fermer', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;

    // Charger les messages reçus
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

    // Charger les non lus
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

  onReply(message: MessageResponse): void { 
    const dialogRef = this.dialog.open(ReplyMessageDialogComponent, {
      width: '600px',
      data: { originalMessage: message }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendReply(result);
      }
    });
  }
  
  private sendReply(replyData: any): void {
    this.messageService.sendMessage(replyData).subscribe({
      next: () => {
        this.showSuccess('Réponse envoyée avec succès !');
        this.loadMessages(); // Recharger les messages
      },
      error: (err) => {
        console.error('Erreur envoi réponse:', err);
        this.showError('Erreur lors de l\'envoi de la réponse');
      }
    });
}

  onMarkAsRead(messageId: string): void {
    this.messageService.markMessageAsRead(messageId).subscribe({
      next: () => {
        this.showSuccess('Message marqué comme lu');
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erreur marquage lu:', err);
        this.showError('Erreur lors du marquage');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}