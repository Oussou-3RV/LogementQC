import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { Annonce } from '../../../../shared/models/annonce.model';

@Component({
  selector: 'app-annonce-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDivider
  ],
  templateUrl: './annonce-table.component.html',
  styleUrls: ['./annonce-table.component.scss']
})
export class AnnonceTableComponent {
  @Input() annonces: Annonce[] = [];
  @Output() toggleStatus = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  displayedColumns: string[] = ['photo', 'titre', 'ville', 'montant', 'vues', 'status', 'actions'];

  constructor(private router: Router) {}

  viewDetails(id: string): void {
    this.router.navigate(['/annonces', id]);
  }

  onToggleStatus(id: string): void {
    this.toggleStatus.emit(id);
  }

  onEdit(id: string): void {
    this.edit.emit(id);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  getMainPhoto(annonce: Annonce): string {
    return annonce.photos && annonce.photos.length > 0 
      ? annonce.photos[0] 
      : 'https://via.placeholder.com/100x75?text=Pas+de+photo';
  }
}