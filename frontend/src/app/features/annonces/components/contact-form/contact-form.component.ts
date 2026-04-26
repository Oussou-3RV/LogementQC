import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  @Input() annonceId!: string;
  @Input() utilisateurId!: string;  // (le propriétaire de l'annonce)
  @Input() isAuthenticated = false;
  @Output() messageSent = new EventEmitter<any>();  //  CHANGE le type

  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(5)]],
      contenu: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }

    // Émettre avec annonceId et destinataireId
    const messageData = {
      annonceId: this.annonceId,
      destinataireId: this.utilisateurId,
      sujet: this.contactForm.value.sujet,
      contenu: this.contactForm.value.contenu
    };

    this.messageSent.emit(messageData);
    this.contactForm.reset();
    this.submitted = false;
  }
}