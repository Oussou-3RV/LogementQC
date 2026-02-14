import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Annonce } from '@app/shared/models/annonce.model'; // Chemin relatif
import { AnnonceService } from '../../../../core/services/annonce.service'; // Chemin relatif
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { AnnonceListComponent } from '../../components/annonce-list/annonce-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    AnnonceListComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  annonces: Annonce[] = [];
  loading = false;

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.loading = true;
    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.loading = false;
      }
    });
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      this.loadAnnonces();
      return;
    }

    this.loading = true;
    this.annonceService.searchAnnonces(query).subscribe({
      next: (data) => {
        this.annonces = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche:', err);
        this.loading = false;
      }
    });
  }
}