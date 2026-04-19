import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

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
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
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
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Étape 1: Compte
    this.accountFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Étape 2: Informations personnelles
    this.personalFormGroup = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });

    // Étape 3: Adresse
    this.addressFormGroup = this.fb.group({
      rue: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      province: ['', [Validators.required]],
      codePostal: ['', [Validators.required, Validators.pattern(/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i)]],
      pays: ['Canada', [Validators.required]]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { mismatch: true };
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    
    this.personalFormGroup.patchValue({ telephone: value }, { emitEvent: false });
  }

  formatPostalCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3, 6)}`;
    }
    
    this.addressFormGroup.patchValue({ codePostal: value }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.accountFormGroup.valid && this.personalFormGroup.valid && this.addressFormGroup.valid) {
      this.loading = true;

      const registerData = {
        email: this.accountFormGroup.value.email,
        password: this.accountFormGroup.value.password,
        nom: this.personalFormGroup.value.nom,
        prenom: this.personalFormGroup.value.prenom,
        telephone: this.personalFormGroup.value.telephone,
        rue: this.addressFormGroup.value.rue,
        ville: this.addressFormGroup.value.ville,
        province: this.addressFormGroup.value.province,
        codePostal: this.addressFormGroup.value.codePostal,
        pays: this.addressFormGroup.value.pays
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          console.log('Registration successful');
          this.snackBar.open('Inscription réussie ! Bienvenue !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          const errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir tous les champs correctement', 'Fermer', { duration: 3000 });
    }
  }
}