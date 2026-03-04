import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent {
  profileForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.profileForm = this.fb.group({
      prenom: [data.user.prenom, [Validators.required, Validators.minLength(2)]],
      nom: [data.user.nom, [Validators.required, Validators.minLength(2)]],
      email: [data.user.email, [Validators.required, Validators.email]],
      telephone: [data.user.telephone, [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      rue: [data.user.adresse.rue, Validators.required],
      ville: [data.user.adresse.ville, Validators.required],
      province: [data.user.adresse.province, Validators.required],
      codePostal: [data.user.adresse.codePostal, [Validators.required, Validators.pattern(/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i)]],
      pays: [data.user.adresse.pays, Validators.required]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    this.profileForm.patchValue({ telephone: value });
  }

  formatPostalCode(event: any): void {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length >= 4) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6);
    }
    this.profileForm.patchValue({ codePostal: value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    const updatedUser: User = {
      ...this.data.user,
      prenom: this.profileForm.value.prenom,
      nom: this.profileForm.value.nom,
      email: this.profileForm.value.email,
      telephone: this.profileForm.value.telephone,
      adresse: {
        rue: this.profileForm.value.rue,
        ville: this.profileForm.value.ville,
        province: this.profileForm.value.province,
        codePostal: this.profileForm.value.codePostal,
        pays: this.profileForm.value.pays
      },
      updatedAt: new Date()
    };

    this.dialogRef.close(updatedUser);
  }
}