import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageResponse } from '../../../../core/services/message-http.service';

@Component({
  selector: 'app-reply-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: 'reply-message-dialog.component.html',
  styleUrls: ['./reply-message-dialog.component.scss']
})
export class ReplyMessageDialogComponent {
  replyForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReplyMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { originalMessage: MessageResponse }
  ) {
    this.replyForm = this.fb.group({
      sujet: [`Re: ${data.originalMessage.sujet}`, [Validators.required, Validators.minLength(5)]],
      contenu: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.replyForm.valid) {
      this.dialogRef.close({
        annonceId: this.data.originalMessage.annonceId,
        sujet: this.replyForm.value.sujet,
        contenu: this.replyForm.value.contenu
      });
    }
  }
}