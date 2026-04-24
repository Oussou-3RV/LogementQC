import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageResponse } from '../../../../core/services/message-http.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './message-list.component.html',

})
export class MessageListComponent {
  @Input() messages: MessageResponse[] = [];
  @Input() type: 'received' | 'sent' = 'received';
  @Output() markAsRead = new EventEmitter<string>();
  @Output() reply = new EventEmitter<MessageResponse>();

  onMarkAsRead(messageId: string): void {
    this.markAsRead.emit(messageId);
  }
  
  onReply(message: MessageResponse): void {
    this.reply.emit(message);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}