import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';
import { EditProfileModalComponent } from '../../components/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EditProfileModalComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  user: any = null;
  myAnnonces: AnnonceResponse[] = [];
  loading = true;
  showEditModal = false;
  saving = false;

  constructor(
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router
  ) {
    // Récupérer l'utilisateur connecté
    this.user = this.authService.currentUser();
    
    if (!this.user) {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    
    // Charger les annonces de l'utilisateur
    this.annonceService.loadMyAnnonces().subscribe({
      next: () => {
        this.myAnnonces = this.annonceService.myAnnonces();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement annonces:', err);
        this.loading = false;
      }
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveProfile(profileData: any): void {
    this.saving = true;
    
    this.authService.updateProfile(profileData).subscribe({
      next: () => {
        // Mettre à jour l'utilisateur local
        this.user = this.authService.currentUser();
        this.showEditModal = false;
        this.saving = false;
        this.showSuccessToast('Profil mis à jour avec succès !');
      },
      error: (err) => {
        console.error('Erreur mise à jour profil:', err);
        this.saving = false;
        this.showErrorToast('Erreur lors de la mise à jour du profil');
      }
    });
  }

  get activeAnnoncesCount(): number {
    return this.myAnnonces.filter(a => a.active).length;
  }

  get inactiveAnnoncesCount(): number {
    return this.myAnnonces.filter(a => !a.active).length;
  }

  // Toast Tailwind simple
  private showSuccessToast(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorToast(message: string): void {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    // Créer un élément toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all transform translate-x-0 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.classList.add('opacity-100');
    }, 10);
    
    // Retirer après 3 secondes
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}