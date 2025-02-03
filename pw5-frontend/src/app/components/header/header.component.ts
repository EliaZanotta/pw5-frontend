import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../auth/auth.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// User, Handshake, and Inbox icons
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { faHandshake as faHandshakeSolid } from '@fortawesome/free-solid-svg-icons';
import { faHandshake as faHandshakeRegular } from '@fortawesome/free-regular-svg-icons';
import { faInbox as faInboxSolid } from '@fortawesome/free-solid-svg-icons';  // Inbox icon from FontAwesome

import { SpeakerRequestModalComponent } from './speaker-request-modal/speaker-request-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, SpeakerRequestModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  user: User | null = null;
  isHost: boolean = false;
  isSpeaker: boolean = false;
  showModal: boolean = false;

  // Hover state flags
  isHoveredUser: boolean = false;
  isHoveredHandshake: boolean = false;
  isHoveredInbox: boolean = false;  // Hover state for inbox icon

  // Icon definitions
  faUserSolid = faUserSolid;
  faUserRegular = faUserRegular;
  faHandshakeSolid = faHandshakeSolid;
  faHandshakeRegular = faHandshakeRegular;
  faInboxSolid = faInboxSolid;

  constructor(private authService: AuthService, library: FaIconLibrary) {
    library.addIcons(faUserSolid, faUserRegular, faHandshakeSolid, faHandshakeRegular, faInboxSolid);
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
  }

  private async loadUser(): Promise<void> {
    // Try to fetch a regular user first
    try {
      const userResult = (await this.authService.getLoggedUser()).user;
      if (userResult) {
        this.user = userResult;
        this.isSpeaker = userResult.role?.toUpperCase() === 'SPEAKER';
        this.isHost = false;  // Not a host if a regular user is found
        return;
      }
    } catch (error) {
      console.error('Error fetching logged user:', error);
    }

    // If no regular user is found, try fetching a host
    try {
      const hostResult = (await this.authService.getLoggedHost()).host;
      if (hostResult) {
        this.user = hostResult;
        this.isHost = true;
        this.isSpeaker = false;  // Hosts are not speakers
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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
