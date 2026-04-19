import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnnonceResponse } from '../../../../core/services/annonce-http.service';

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './annonce-list.component.html',
  styleUrls: ['./annonce-list.component.scss']
})
export class AnnonceListComponent {
  @Input() annonces: AnnonceResponse[] = [];
  @Input() loading = false;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}