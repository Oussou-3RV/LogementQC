import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';
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
export class ProfilePageComponent implements OnInit {
  currentUser: any = null;
  userAnnonces: AnnonceResponse[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Vérifier si l'utilisateur est connecté (appel de fonction signal)
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Vous devez être connecté pour voir votre profil', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    // Récupérer l'utilisateur via signal
    const user = this.authService.currentUser();
    
    if (user) {
      this.currentUser = user;
      this.loadUserAnnonces();
    } else {
      this.router.navigate(['/auth/login']);
    }
    
    this.loading = false;
  }

  loadUserAnnonces(): void {
    this.annonceService.loadMyAnnonces().subscribe({
      next: () => {
        this.userAnnonces = this.annonceService.myAnnonces();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des annonces:', err);
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

  updateProfile(updatedUser: any): void {
    // TODO: Implémenter updateProfile dans AuthService
    console.log('Update profile:', updatedUser);
    this.currentUser = { ...this.currentUser, ...updatedUser };
    this.showSuccess('Profil mis à jour avec succès !');
    
    /*
    this.authService.updateProfile(updatedUser).subscribe({
      next: (user: any) => {
        this.currentUser = user;
        this.showSuccess('Profil mis à jour avec succès !');
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour:', err);
        this.showError('Erreur lors de la mise à jour du profil');
      }
    });
    */
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