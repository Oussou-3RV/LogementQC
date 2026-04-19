import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-modal.component.html',

})
export class EditProfileModalComponent {
  @Input() user: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  profileForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      rue: ['', Validators.required],
      ville: ['', Validators.required],
      province: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern(/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i)]],
      pays: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.profileForm.patchValue({
        nom: this.user.nom,
        prenom: this.user.prenom,
        telephone: this.user.telephone,
        rue: this.user.rue,
        ville: this.user.ville,
        province: this.user.province,
        codePostal: this.user.codePostal,
        pays: this.user.pays
      });
    }
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    
    this.profileForm.patchValue({ telephone: value }, { emitEvent: false });
  }

  formatPostalCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3, 6)}`;
    }
    
    this.profileForm.patchValue({ codePostal: value }, { emitEvent: false });
  }

  onCancel(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.save.emit(this.profileForm.value);
    }
  }
}