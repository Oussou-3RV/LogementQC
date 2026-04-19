import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {  Annonce } from '@app/shared/models/annonce.model'
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';


@Component({
  selector: 'app-annonce-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './annonce-card.component.html',
  styleUrls: ['./annonce-card.component.scss']
})
export class AnnonceCardComponent {
  @Input() annonce!: AnnonceResponse;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/annonces', this.annonce.id]);
  }

  getMainPhoto(): string {
    return this.annonce.photos && this.annonce.photos.length > 0 
      ? this.annonce.photos[0] 
      : 'https://via.placeholder.com/400x300?text=Pas+de+photo';
  }
}