import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { Annonce } from '../../../../shared/models/annonce.model';
import { AnnonceTableComponent } from '../../components/annonce-table/annonce-table.component';

@Component({
  selector: 'app-mes-annonces',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    AnnonceTableComponent
  ],
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.scss']
})
export class MesAnnoncesComponent implements OnInit {
  allAnnonces: Annonce[] = [];
  activeAnnonces: Annonce[] = [];
  inactiveAnnonces: Annonce[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated) {
      this.snackBar.open('Vous devez être connecté pour voir vos annonces', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadMyAnnonces();
  }

  loadMyAnnonces(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser?.id) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.annonceService.getAnnoncesByUserId(currentUser.id).subscribe({
      next: (annonces) => {
        this.allAnnonces = annonces;
        this.activeAnnonces = annonces.filter(a => a.active);
        this.inactiveAnnonces = annonces.filter(a => !a.active);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.loading = false;
        this.showError('Erreur lors du chargement de vos annonces');
      }
    });
  }

  onToggleStatus(id: string): void {
    this.annonceService.toggleAnnonceStatus(id).subscribe({
      next: (annonce) => {
        if (annonce) {
          this.showSuccess(annonce.active ? 'Annonce activée' : 'Annonce désactivée');
          this.loadMyAnnonces();
        }
      },
      error: (err) => {
        this.showError('Erreur lors de la modification du statut');
      }
    });
  }

  onEdit(id: string): void {
    // TODO: Implémenter la page d'édition
    this.showInfo('La modification sera disponible prochainement');
    // this.router.navigate(['/annonces/edit', id]);
  }

  onDelete(id: string): void {
    // TODO: Implémenter avec confirmation dialog
    this.showInfo('La suppression sera disponible prochainement');
  }

  goToCreateAnnonce(): void {
    this.router.navigate(['/annonces/create']);
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

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}