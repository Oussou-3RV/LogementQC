import { Component } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import {HomePageComponent} from '@app/features/home/pages/home-page/home-page.component'

@Component({
  selector: 'app-root',
  imports: [NavbarComponent,FooterComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Application Annonces';
}