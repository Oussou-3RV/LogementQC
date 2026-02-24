import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { AnnonceDetailComponent } from './features/annonces/pages/annonce-detail/annonce-detail.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { CreateAnnonceComponent } from './features/annonces/pages/create-annonce/create-annonce.component';

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
    path: 'annonces/:id',
    component: AnnonceDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
