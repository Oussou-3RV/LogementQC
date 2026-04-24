import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';

@Component({
  selector: 'app-create-annonce',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-annonce.component.html',
  styleUrls: ['./create-annonce.component.scss']
})
export class CreateAnnonceComponent implements OnInit {
  basicInfoForm: FormGroup;
  addressForm: FormGroup;
  photosForm: FormGroup;
  loading = false;
  photoUrls: string[] = [];
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.showErrorToast('Vous devez être connecté pour publier une annonce');
      this.router.navigate(['/auth/login']);
    }

    // Formulaire 1: Informations de base
    this.basicInfoForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(10)]],
      descriptionCourte: ['', [Validators.required, Validators.minLength(20)]],
      descriptionLongue: ['', [Validators.required, Validators.minLength(50)]],
      montantMensuel: ['', [Validators.required, Validators.min(100)]],
      dateDisponibilite: ['', Validators.required]
    });

    // Formulaire 2: Adresse
    this.addressForm = this.fb.group({
      rue: ['', Validators.required],
      ville: ['', Validators.required],
      province: ['QC', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern(/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i)]],
      pays: ['Canada', Validators.required]
    });

    // Formulaire 3: Photos
    this.photosForm = this.fb.group({
      photoUrl: ['', Validators.pattern(/^https?:\/\/.+/)]
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep === 1 && this.basicInfoForm.valid) {
      this.currentStep = 2;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 2 && this.addressForm.valid) {
      this.currentStep = 3;
      window.scrollTo(0, 0);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatPostalCode(event: any): void {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length >= 4) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6);
    }
    this.addressForm.patchValue({ codePostal: value }, { emitEvent: false });
  }

  addPhoto(): void {
    const url = this.photosForm.get('photoUrl')?.value;
    if (url && url.trim()) {
      this.photoUrls.push(url.trim());
      this.photosForm.patchValue({ photoUrl: '' });
    }
  }

  removePhoto(index: number): void {
    this.photoUrls.splice(index, 1);
  }

  onSubmit(): void {
    // Vérifier que tous les formulaires sont valides
    if (this.basicInfoForm.valid && this.addressForm.valid) {
      this.loading = true;
      const currentUser = this.authService.currentUser();
  
      if (!currentUser) {
        this.showErrorToast('Vous devez être connecté');
        this.router.navigate(['/auth/login']);
        this.loading = false;
        return;
      }

      // Vérifier qu'il y a au moins une photo
      if (this.photoUrls.length === 0) {
        this.showErrorToast('Veuillez ajouter au moins une photo');
        this.loading = false;
        return;
      }

      // Formater la date pour l'API (YYYY-MM-DD)
      const dateDisponibilite = this.basicInfoForm.value.dateDisponibilite;
      const formattedDate = dateDisponibilite instanceof Date 
        ? dateDisponibilite.toISOString().split('T')[0] 
        : dateDisponibilite;
  
      const newAnnonce = {
        titre: this.basicInfoForm.value.titre,
        descriptionCourte: this.basicInfoForm.value.descriptionCourte,
        descriptionLongue: this.basicInfoForm.value.descriptionLongue,
        montantMensuel: parseFloat(this.basicInfoForm.value.montantMensuel),
        dateDisponibilite: formattedDate,
        photos: this.photoUrls,
        rue: this.addressForm.value.rue,
        ville: this.addressForm.value.ville,
        province: this.addressForm.value.province,
        codePostal: this.addressForm.value.codePostal,
        pays: this.addressForm.value.pays
      };
  
      this.annonceService.createAnnonce(newAnnonce).subscribe({
        next: () => {
          this.showSuccessToast('Annonce créée avec succès !');
          this.router.navigate(['/annonces/mes-annonces']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          const errorMsg = err.error?.message || 'Erreur lors de la création de l\'annonce';
          this.showErrorToast(errorMsg);
          this.loading = false;
        }
      });
    } else {
      this.showErrorToast('Veuillez remplir tous les champs obligatoires');
    }
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