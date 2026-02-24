import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Annonce } from '@app/shared/models/annonce.model';
import { AnnonceService } from '@app/core/services/annonce.service';
import { MessageService } from '@app/core/services/message.service';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';

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
export class AnnonceDetailComponent implements OnInit {
  annonce: Annonce | undefined;
  loading = true;
  isAuthenticated = true; // TODO: Sera géré par AuthService plus tard
  currentUserId = 'user-logged-in'; // TODO: Récupérer de AuthService

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnnonce(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadAnnonce(id: string): void {
    this.loading = true;
    this.annonceService.getAnnonceById(id).subscribe({
      next: (data) => {
        if (data) {
          this.annonce = data;
          this.annonceService.incrementConsultations(id);
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
      }
    });
  }

  onMessageSent(message: { sujet: string; contenu: string }): void {
    if (!this.annonce) return;

    this.messageService.sendMessage({
      annonceId: this.annonce.id!,
      expediteurId: this.currentUserId,
      destinataireId: this.annonce.userId,
      sujet: message.sujet,
      contenu: message.contenu,
      // lu: false
    }).subscribe({
      next: () => {
        this.showSuccess('Message envoyé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
        this.showError('Erreur lors de l\'envoi du message');
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