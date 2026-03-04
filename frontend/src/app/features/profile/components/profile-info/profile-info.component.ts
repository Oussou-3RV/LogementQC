import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<void>();

  onEdit(): void {
    this.edit.emit();
  }

  //Return les initials de l'utilisateur
  getInitials(): string {
    if (!this.user) return '?';
    return `${this.user.prenom.charAt(0)}${this.user.nom.charAt(0)}`.toUpperCase();
  }
}