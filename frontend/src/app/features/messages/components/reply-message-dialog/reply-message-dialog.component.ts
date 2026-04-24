import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageResponse } from '../../../../core/services/message-http.service';

@Component({
  selector: 'app-reply-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reply-message-dialog.component.html',
  styleUrls: ['./reply-message-dialog.component.scss']
})
export class ReplyMessageDialogComponent implements OnInit {
  @Input() originalMessage!: MessageResponse;
  @Output() close = new EventEmitter<void>();
  @Output() send = new EventEmitter<any>();

  replyForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.replyForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(5)]],
      contenu: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    if (this.originalMessage) {
      this.replyForm.patchValue({
        sujet: `Re: ${this.originalMessage.sujet}`
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onSend(): void {
    if (this.replyForm.valid) {
      this.send.emit({
        annonceId: this.originalMessage.annonceId,
        sujet: this.replyForm.value.sujet,
        contenu: this.replyForm.value.contenu
      });
    }
  }
}