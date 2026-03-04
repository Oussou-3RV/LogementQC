import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { User } from '../../../../shared/models/user.model';
import { Annonce } from '../../../../shared/models/annonce.model';
import { ProfileInfoComponent } from '../../components/profile-info/profile-info.component';
import { EditProfileDialogComponent } from '../../components/edit-profile-dialog/edit-profile-dialog.component';
import { AnnonceCardComponent } from '../../../home/components/annonce-card/annonce-card.component';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    ProfileInfoComponent,
    AnnonceCardComponent,
    FilterPipe
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userAnnonces: Annonce[] = [];
  loading = true;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated) {
      this.snackBar.open('Vous devez être connecté pour voir votre profil', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.id) {
        this.loadUserAnnonces(user.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  loadUserAnnonces(userId: string): void {
    this.loading = true;
    this.annonceService.getAnnoncesByUserId(userId).subscribe({
      next: (annonces) => {
        this.userAnnonces = annonces;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.loading = false;
      }
    });
  }

  getTotalViews(): number {
    return this.userAnnonces.reduce((total, annonce) => total + annonce.nombreConsultations, 0);
  }

  onEditProfile(): void {
    if (!this.currentUser) return;

    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '600px',
      data: { user: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProfile(result);
      }
    });
  }

  updateProfile(updatedUser: User): void {
    this.authService.updateProfile(updatedUser).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.showSuccess('Profil mis à jour avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        this.showError('Erreur lors de la mise à jour du profil');
      }
    });
  }

  goToMesAnnonces(): void {
    this.router.navigate(['/annonces/mes-annonces']);
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
}