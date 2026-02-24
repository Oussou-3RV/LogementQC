import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { AnnonceDetailComponent } from './features/annonces/pages/annonce-detail/annonce-detail.component';
import { CreateAnnonceComponent } from './features/annonces/pages/create-annonce/create-annonce.component';
import { MesAnnoncesComponent } from './features/annonces/pages/mes-annonces/mes-annonces.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'annonces/create',
    component: CreateAnnonceComponent
  },
  {
    path: 'annonces/mes-annonces',
    component: MesAnnoncesComponent
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