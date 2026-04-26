import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-annonce-detail',
  standalone: true,
  imports: [
    CommonModule,
    PhotoGalleryComponent,
    ContactFormComponent
  ],
  templateUrl: './annonce-detail.component.html',
  styleUrls: ['./annonce-detail.component.scss']
})
export class AnnonceDetailComponent implements OnInit, OnDestroy {
  annonce: AnnonceResponse | null = null;
  loading = true;
  isAuthenticated = false;
  currentUserId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private annonceService: AnnonceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    const user = this.authService.currentUser();
    this.currentUserId = user?.id || '';

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnnonce(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  loadAnnonce(id: string): void {
    this.loading = true;
    this.annonceService.loadAnnonceById(id).subscribe({
      next: () => {
        const selectedAnnonce = this.annonceService.selectedAnnonce();
        if (selectedAnnonce) {
          this.annonce = selectedAnnonce;
        } else {
          this.showErrorToast('Annonce introuvable');
          this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'annonce:', err);
        this.showErrorToast('Erreur lors du chargement');
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  onMessageSent(message: { sujet: string; contenu: string }): void {
  
    if (!this.annonce) return;
  
    if (!this.isAuthenticated) {
      this.showErrorToast('Vous devez être connecté pour envoyer un message');
      this.router.navigate(['/auth/login']);
      return;
    }
  
    this.messageService.sendMessage({
      annonceId: this.annonce.id,
      destinataireId: this.annonce.userId,
      sujet: message.sujet,
      contenu: message.contenu
    }).subscribe({
      next: () => {
        this.showSuccessToast('Message envoyé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
        const errorMsg = err.error?.message || 'Erreur lors de l\'envoi du message';
        this.showErrorToast(errorMsg);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
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