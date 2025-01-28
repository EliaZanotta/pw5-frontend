import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pw5-frontend';

  showHeaderFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showHeaderFooter = !this.router.url.includes('auth') && !this.router.url.includes('register');
    });
  }
}
