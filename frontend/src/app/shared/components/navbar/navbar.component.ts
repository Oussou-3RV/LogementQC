import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isAuthenticated = false;
  currentUser: any = null;
  unreadCount = 0;
  showUserMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    effect(() => {
      const user = this.authService.currentUser();
      this.isAuthenticated = this.authService.isAuthenticated();
      this.currentUser = user;
      
      console.log('🔄 Navbar updated - User:', user ? user.email : 'none');
      
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

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstInitial = this.currentUser.prenom?.charAt(0) || '';
    const lastInitial = this.currentUser.nom?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateTo(route: string): void {
    this.showUserMenu = false;
    this.router.navigate([route]);
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}