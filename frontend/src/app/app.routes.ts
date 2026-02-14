import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { AnnonceDetailComponent } from './features/annonces/pages/annonce-detail/annonce-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    },

    {
        path: 'annonces/:id',
        component: AnnonceDetailComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
