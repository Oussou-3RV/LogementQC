import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnonceService } from '../../../../core/services/annonce.service';
import { Annonce } from '@app/shared/models/annonce.model';

@Component({
  selector: 'app-create-annonce',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatStepperModule
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private annonceService: AnnonceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated) {
      this.snackBar.open('Vous devez être connecté pour publier une annonce', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
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

  formatPostalCode(event: any): void {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length >= 4) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6);
    }
    this.addressForm.patchValue({ codePostal: value });
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
    if (this.basicInfoForm.invalid || this.addressForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    if (this.photoUrls.length === 0) {
      this.snackBar.open('Veuillez ajouter au moins une photo', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    this.loading = true;
  
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
  
    const newAnnonce: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'> = {
      titre: this.basicInfoForm.value.titre,
      descriptionCourte: this.basicInfoForm.value.descriptionCourte,
      descriptionLongue: this.basicInfoForm.value.descriptionLongue,
      montantMensuel: parseFloat(this.basicInfoForm.value.montantMensuel),
      dateDisponibilite: new Date(this.basicInfoForm.value.dateDisponibilite),
      photos: this.photoUrls,
      adresse: {
        rue: this.addressForm.value.rue,
        ville: this.addressForm.value.ville,
        province: this.addressForm.value.province,
        codePostal: this.addressForm.value.codePostal,
        pays: this.addressForm.value.pays
      },
      userId: currentUser.id!,
      nombreConsultations: 0,
      active: true
    };
  
    // Utiliser le service pour créer l'annonce
    this.annonceService.createAnnonce(newAnnonce).subscribe({
      next: (createdAnnonce) => {
        this.loading = false;
        this.snackBar.open('Annonce publiée avec succès ! 🎉', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Erreur lors de la publication', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}