import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../auth/auth.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, interval, startWith } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Icons
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { faHandshake as faHandshakeSolid } from '@fortawesome/free-solid-svg-icons';
import { faHandshake as faHandshakeRegular } from '@fortawesome/free-regular-svg-icons';
import { faInbox as faInboxSolid } from '@fortawesome/free-solid-svg-icons';

import { SpeakerRequestModalComponent } from './speaker-request-modal/speaker-request-modal.component';
import { AdminNotificationModalComponent } from './admin-notification-modal/admin-notification-modal.component';
import { AdminNotification, SpeakerRequest, InboxService } from './inbox.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, SpeakerRequestModalComponent, AdminNotificationModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  user: User | null = null;
  isHost: boolean = false;
  isSpeaker: boolean = false;
  isAdmin: boolean = false;
  showSpeakerModal: boolean = false;
  showAdminModal: boolean = false;

  // Hover state flags
  isHoveredUser: boolean = false;
  isHoveredHandshake: boolean = false;
  isHoveredInbox: boolean = false;
  isHoveredAdminInbox: boolean = false;

  hasUnreadNotifications: boolean = false;  // New flag to indicate unread admin notifications
  hasPendingRequests: boolean = false;       // New flag to indicate pending speaker requests

  // Icon definitions
  faUserSolid = faUserSolid;
  faUserRegular = faUserRegular;
  faHandshakeSolid = faHandshakeSolid;
  faHandshakeRegular = faHandshakeRegular;
  faInboxSolid = faInboxSolid;

  constructor(private authService: AuthService, private inboxService: InboxService, library: FaIconLibrary) {
    library.addIcons(faUserSolid, faUserRegular, faHandshakeSolid, faHandshakeRegular, faInboxSolid);
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();

    if (this.isAdmin) {
      this.fetchAdminNotifications();
    }

    if (this.isSpeaker) {
      this.fetchSpeakerRequests();
    }
  }

  private async loadUser(): Promise<void> {
    try {
      const userResult = (await this.authService.getLoggedUser()).user;
      if (userResult) {
        this.user = userResult;
        this.isSpeaker = userResult.role?.toUpperCase() === 'SPEAKER';
        this.isAdmin = userResult.role?.toUpperCase() === 'ADMIN';
        this.isHost = false;
        return;
      }
    } catch (error) {
      console.error('Error fetching logged user:', error);
    }

    // Try to fetch a host if no regular user was found
    try {
      const hostResult = (await this.authService.getLoggedHost()).host;
      if (hostResult) {
        this.user = hostResult;
        this.isHost = true;
        this.isSpeaker = false;
        this.isAdmin = false;
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error('Error fetching logged host:', error);
      this.user = null;
    }
  }

  private fetchAdminNotifications(): void {
    interval(10000)
      .pipe(
        startWith(0), // Trigger the first fetch immediately
        switchMap(() => this.inboxService.getAdminNotifications())
      )
      .subscribe((notifications: AdminNotification[]) => {
        this.hasUnreadNotifications = notifications.some(n => n.status === 'UNREAD');
      });
  }

  private fetchSpeakerRequests(): void {
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.inboxService.getSpeakerRequests())
      )
      .subscribe((requests: SpeakerRequest[]) => {
        this.hasPendingRequests = requests.some(r => r.status === 'PENDING');
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }

  openSpeakerModal(): void {
    this.showSpeakerModal = true;
  }

  closeSpeakerModal(): void {
    this.showSpeakerModal = false;
    this.fetchSpeakerRequests();
  }

  openAdminModal(): void {
    this.showAdminModal = true;
  }

  closeAdminModal(): void {
    this.showAdminModal = false;
    this.fetchAdminNotifications();
  }
}
