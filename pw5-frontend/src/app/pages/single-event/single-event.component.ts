import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDays, faMapPin, faUsers, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { EventsService, Event } from '../events/events.service';
import {BookingComponent} from '../../components/booking/booking.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css'],
  imports: [CommonModule, NgIf, NgForOf, FontAwesomeModule, BookingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SingleEventComponent implements OnInit {
  eventData: Event | null = null;
  errorMessage: string | null = null;

  // FontAwesome icons
  faCalendarDays = faCalendarDays;
  faMapPin = faMapPin;
  faUsers = faUsers;
  faTicket = faTicket;
  faUser = faUser;

  constructor(private eventsService: EventsService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvent();
  }

  fetchEvent(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.eventsService.getEventById(id).subscribe({
        next: (response: any) => {
          this.eventData = response.event; // Accessing event inside the response object
        },
        error: () => {
          this.errorMessage = 'Errore durante il recupero dei dati dell\'evento. Riprova più tardi.';
        }
      });
    } else {
      this.errorMessage = 'Nessun ID evento trovato nei parametri del percorso.';
    }
  }


  formatDate(dateString: string): string {
    if (!dateString) {
      return 'Data non disponibile';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data non valida';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  }
  formatMaxParticipants(maxParticipants: number | null): string {
    return maxParticipants === 0 ? 'Infinity' : (maxParticipants || 'Illimitati').toString();
  }

  formatEventSubscription(eventSubscription: string | null): string {
    if (!eventSubscription) {
      return 'Tipo non disponibile';
    }
    return eventSubscription === 'paid' ? 'Evento a pagamento' : 'Evento gratis';
  }

 showBookingDialog(eventName: string) {
    this.dialog.open(BookingComponent, {
      width: '500px',
      disableClose: true,
      data: {eventName: this.eventData?.title}
    });
 }

}
