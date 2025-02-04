import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, User} from '../../auth/auth.service';
import {Event, EventsService} from '../events/events.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.css'],
  imports: [DatePipe, NgForOf, NgIf],
  standalone: true
})
export class UserAreaComponent implements OnInit {
  user: User | null = null;
  avatar: string = 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg'
  image: string = 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg'

  selectedTab: string = 'bookedEvents';
  isConfirmTicketModalOpen: boolean = false;
  isRevokeEventModalOpen: boolean = false;
  selectedEvent: any = null;

  constructor(private router: Router, private authService: AuthService, private eventsService: EventsService, private snackBar: MatSnackBar) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user = (await this.authService.getLoggedUser()).user;
      console.log(this.user);
    } catch (errorResponse: any) {
      if (errorResponse.status === 401) {
        await this.router.navigate(['/auth/login']);
      }
    }
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  openConfirmTicketModal(event?: Event): void {
    if (!this.isConfirmTicketModalOpen) {
      this.selectedEvent = event;
      this.isConfirmTicketModalOpen = true;
    }
  }

  openRevokeEventModal(event?: Event) {
    if (!this.isRevokeEventModalOpen) {
      this.selectedEvent = event;
      this.isRevokeEventModalOpen = true;
    }
  }

  closeModal(): void {
    this.isConfirmTicketModalOpen = false;
    this.isRevokeEventModalOpen = false;
    this.selectedEvent = null;
  }

  activateTicket(): void {
    alert(`✅ Ticket attivato per: ${this.selectedEvent?.title || "evento"}!`);
    this.closeModal();
  }

  async revokeEvent(): Promise<void> {
    const payload = {
      id: this.selectedEvent?.id
    }

    try {
      let response = await this.eventsService.revokeEvent(payload);
      let event = response.event;
      if (event) {
        this.snackBar.open('Evento revocato con successo!', 'Chiudi', {
          duration: 20000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success-snackbar'
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.snackBar.open("Errore durante la revoca dell'evento", 'Chiudi', {
          duration: 20000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
    this.closeModal();
  }
}
