import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';

@Component({
  selector: 'app-mes-annonces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.scss']
})
export class MesAnnoncesComponent implements OnInit {
  allAnnonces: AnnonceResponse[] = [];
  activeAnnonces: AnnonceResponse[] = [];
  inactiveAnnonces: AnnonceResponse[] = [];
  loading = true;
  selectedTab: 'all' | 'active' | 'inactive' = 'all';

  constructor(
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.showErrorToast('Vous devez être connecté pour voir vos annonces');
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadMyAnnonces();
  }

  loadMyAnnonces(): void {
    this.loading = true;
    const currentUser = this.authService.currentUser();
  
    if (!currentUser) {
      this.showErrorToast('Vous devez être connecté');
      this.router.navigate(['/auth/login']);
      return;
    }
  
    this.annonceService.loadMyAnnonces().subscribe({
      next: () => {
        const annonces = this.annonceService.myAnnonces();
        this.allAnnonces = annonces;
        this.activeAnnonces = annonces.filter((a) => a.active);
        this.inactiveAnnonces = annonces.filter((a) => !a.active);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.showErrorToast('Erreur lors du chargement');
        this.loading = false;
      }
    });
  }

  onToggleStatus(id: string): void {
    this.annonceService.toggleAnnonceStatus(id).subscribe({
      next: (annonce) => {
        if (annonce) {
          this.showSuccessToast(annonce.active ? 'Annonce activée' : 'Annonce désactivée');
          this.loadMyAnnonces();
        }
      },
      error: (err) => {
        this.showErrorToast('Erreur lors de la modification du statut');
      }
    });
  }

  onEdit(id: string): void {
    // TODO: Implémenter la page d'édition
    this.showInfoToast('La modification sera disponible prochainement');
    // this.router.navigate(['/annonces/edit', id]);
  }

  onDelete(id: string): void {
    // TODO: Implémenter avec confirmation dialog
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      this.annonceService.deleteAnnonce(id).subscribe({
        next: () => {
          this.showSuccessToast('Annonce supprimée avec succès');
          this.loadMyAnnonces();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.showErrorToast('Erreur lors de la suppression');
        }
      });
    }
  }

  goToCreateAnnonce(): void {
    this.router.navigate(['/annonces/create']);
  }

  private showSuccessToast(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorToast(message: string): void {
    this.showToast(message, 'error');
  }

  private showInfoToast(message: string): void {
    this.showToast(message, 'info');
  }

  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all transform ${bgColor}`;
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