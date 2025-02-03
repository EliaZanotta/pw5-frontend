import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../auth/auth.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { faHandshake as faHandshakeSolid } from '@fortawesome/free-solid-svg-icons';
import { faHandshake as faHandshakeRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  user: User | null = null;
  isHost: boolean = false;
  isHovered: boolean = false; // Tracks hover state for the icon

  // Icon definitions for user and handshake
  faUserSolid = faUserSolid;
  faUserRegular = faUserRegular;
  faHandshakeSolid = faHandshakeSolid;
  faHandshakeRegular = faHandshakeRegular;

  constructor(private authService: AuthService, library: FaIconLibrary) {
    // Add icons to the FontAwesome library
    library.addIcons(faUserSolid, faUserRegular, faHandshakeSolid, faHandshakeRegular);
  }

  async ngOnInit(): Promise<void> {
    console.log('Header initialized');
    await this.loadUser();
  }

  private async loadUser(): Promise<void> {
    // Try to fetch a regular user
    try {
      const userResult = (await this.authService.getLoggedUser()).user;
      console.log('getLoggedUser response:', userResult);
      if (
        userResult &&
        userResult.id &&
        userResult.role &&
        ['SPEAKER', 'USER', 'ADMIN'].includes(userResult.role.toUpperCase())
      ) {
        this.user = userResult;
        this.isHost = false;
        return; // A valid user was found, no need to check for host
      }
    } catch (error) {
      console.error('Error fetching logged user:', error);
    }

    // Try to fetch a host if no regular user was found
    try {
      const hostResult = (await this.authService.getLoggedHost()).host;
      console.log('getLoggedHost response:', hostResult);
      if (
        hostResult &&
        hostResult.id &&
        hostResult.type &&
        ['PARTNER', 'COMPANY'].includes(hostResult.type.toUpperCase())
      ) {
        this.user = hostResult;
        this.isHost = true;
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error('Error fetching logged host:', error);
      this.user = null;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }
}
