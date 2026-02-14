import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Annonce } from '@app/shared/models/annonce.model';
import { AnnonceCardComponent } from '../annonce-card/annonce-card.component';

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AnnonceCardComponent
  ],
  templateUrl: './annonce-list.component.html',
  styleUrls: ['./annonce-list.component.scss']
})
export class AnnonceListComponent {
  @Input() annonces: Annonce[] = [];
  @Input() loading = false;
}