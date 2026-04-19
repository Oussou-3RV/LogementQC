import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
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
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'état d'authentification via signal
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
          this.showError('Annonce introuvable');
          this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'annonce:', err);
        this.showError('Erreur lors du chargement');
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  onMessageSent(message: { sujet: string; contenu: string }): void {
    if (!this.annonce) return;
  
    if (!this.isAuthenticated) {
      this.showError('Vous devez être connecté pour envoyer un message');
      this.router.navigate(['/auth/login']);
      return;
    }
  
    this.messageService.sendMessage({
      annonceId: this.annonce.id,
      sujet: message.sujet,
      contenu: message.contenu
    }).subscribe({
      next: () => {
        this.showSuccess('Message envoyé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
        const errorMsg = err.error?.message || 'Erreur lors de l\'envoi du message';
        this.showError(errorMsg);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}