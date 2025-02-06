import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faMapPin,
  faUsers,
  faTicket,
  faUser,
  faLaptopCode,
  faMicrophoneAlt
} from '@fortawesome/free-solid-svg-icons';
import { EventsService, Event } from '../events/events.service';
import { BookingComponent } from '../../components/booking/booking.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css'],
  imports: [CommonModule, NgIf, NgForOf, FontAwesomeModule],
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
  faLaptopCode = faLaptopCode;
  faMicrophoneAlt = faMicrophoneAlt;


  constructor(private eventsService: EventsService, private route: ActivatedRoute, public dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchEvent();
  }

  async fetchEvent(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      try {
        this.eventData = (await this.eventsService.getEventById(id)).event;
      } catch (errorResponse) {
        if (errorResponse instanceof HttpErrorResponse) {
          this.errorMessage = errorResponse.error.message;
        }
      }
    }
  }


  formatDateRange(startDate: string, endDate: string): string {
    if (!startDate || !endDate) {
      return 'Data non disponibile';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Data non valida';
    }

    const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };

    const formattedDate = start.toLocaleDateString(undefined, optionsDate);
    const formattedStartTime = start.toLocaleTimeString(undefined, optionsTime);
    const formattedEndTime = end.toLocaleTimeString(undefined, optionsTime);

    return `${formattedDate} dalle ore ${formattedStartTime} alle ${formattedEndTime}`;
  }

  formatMaxParticipants(maxParticipants: number | null): string {
    return maxParticipants === 0 ? 'Illimitati' : (maxParticipants || 'Illimitati').toString();
  }

  formatEventSubscription(eventSubscription: string | null): string {
    if (!eventSubscription) {
      return 'Tipo non disponibile';
    }
    return eventSubscription === 'paid' ? 'Evento a pagamento' : 'Evento gratis';
  }

  showBookingDialog() {
    this.dialog.open(BookingComponent, {
      width: '500px',
      disableClose: true,
      data: {
        id: this.eventData?.id,
        eventName: this.eventData?.title
      }
    });
  }

}
