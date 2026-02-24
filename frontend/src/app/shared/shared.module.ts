import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [], // Vide car les composants sont standalone
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NavbarComponent,  // Import au lieu de declare
    FooterComponent   // Import au lieu de declare
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    MaterialModule
  ]
})
export class SharedModule { }