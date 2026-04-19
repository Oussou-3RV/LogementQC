import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '@app/core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDivider
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isAuthenticated = false;
  currentUser: any = null;
  unreadCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    // Utiliser effect pour réagir aux changements du signal d'authentification
    effect(() => {
      const user = this.authService.currentUser();
      this.isAuthenticated = this.authService.isAuthenticated();
      this.currentUser = user;
      
      console.log('🔄 Navbar updated - User:', user ? user.email : 'none');
      
      // Charger les messages non lus si connecté
      if (user) {
        this.loadUnreadCount();
      } else {
        this.unreadCount = 0;
      }
    });
  }

  loadUnreadCount(): void {
    this.messageService.loadUnreadMessages().subscribe({
      next: () => {
        this.unreadCount = this.messageService.unreadMessages().length;
        console.log('📧 Messages non lus:', this.unreadCount);
      },
      error: (err) => {
        console.error('Erreur chargement messages non lus:', err);
        this.unreadCount = 0;
      }
    });
  }

  get userName(): string {
    return this.currentUser ? `${this.currentUser.prenom} ${this.currentUser.nom}` : 'Utilisateur';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}