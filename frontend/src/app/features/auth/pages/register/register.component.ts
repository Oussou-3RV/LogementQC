import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  accountFormGroup: FormGroup;
  personalFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }

    // Formulaire 1: Informations de compte
    this.accountFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Formulaire 2: Informations personnelles
    this.personalFormGroup = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });

    // Formulaire 3: Adresse
    this.addressFormGroup = this.fb.group({
      rue: ['', Validators.required],
      ville: ['', Validators.required],
      province: ['QC', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern(/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i)]],
      pays: ['Canada', Validators.required]
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    this.personalFormGroup.patchValue({ telephone: value });
  }

  formatPostalCode(event: any): void {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length >= 4) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6);
    }
    this.addressFormGroup.patchValue({ codePostal: value });
  }

  onSubmit(): void {
    if (this.accountFormGroup.invalid || this.personalFormGroup.invalid || this.addressFormGroup.invalid) {
      return;
    }

    this.loading = true;

    const userData: Omit<User, 'id' | 'createdAt'> = {
      email: this.accountFormGroup.value.email,
      password: this.accountFormGroup.value.password,
      nom: this.personalFormGroup.value.nom,
      prenom: this.personalFormGroup.value.prenom,
      telephone: this.personalFormGroup.value.telephone,
      adresse: {
        rue: this.addressFormGroup.value.rue,
        ville: this.addressFormGroup.value.ville,
        province: this.addressFormGroup.value.province,
        codePostal: this.addressFormGroup.value.codePostal,
        pays: this.addressFormGroup.value.pays
      }
    };

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.snackBar.open('Inscription réussie ! Bienvenue 🎉', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Erreur lors de l\'inscription', 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}