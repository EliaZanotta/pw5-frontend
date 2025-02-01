import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen: boolean = false; 

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Aggiunge/rimuove la classe per bloccare lo scroll quando il menu è aperto
    if (this.isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }
}
