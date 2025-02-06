import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EventsService} from '../events/events.service';
import {AuthService} from '../../auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Host} from '../../host.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-event-registration-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-registration-form.component.html',
  styleUrls: ['./event-registration-form.component.css'],
  standalone: true
})
export class EventRegistrationFormComponent implements OnInit {
  host: Host | null = null;

  event = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    place: '',
    speakerEmails: [] as string[],
    topics: [] as string[],
    maxParticipants: 0,
    eventType: 'free', // Default value
    price: 0,
  };
  newTopic: string = '';
  newSpeakerEmail: string = '';

  constructor(private eventsService: EventsService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    if (document.cookie.includes('SESSION_ID')) {
      try {
        let response = await this.authService.getLoggedHost();
        if (response.host) {
          this.host = response.host;
        }
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          await this.router.navigate(['/login']);
        }
      }
    } else {
      await this.router.navigate(['/login']);
    }
  }

  addTopic() {
    if (this.newTopic.trim()) {
      this.event.topics.push(this.newTopic.trim());
      this.newTopic = '';
    }
  }

  removeTopic(index: number) {
    this.event.topics.splice(index, 1);
  }

  addSpeakerEmail() {
    if (this.newSpeakerEmail.trim()) {
      this.event.speakerEmails.push(this.newSpeakerEmail.trim());
      this.newSpeakerEmail = '';
    }
  }

  removeSpeakerEmail(index: number) {
    this.event.speakerEmails.splice(index, 1);
  }

  handleFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.value === '0') {
      target.value = '';
    }
  }

  handleBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.value === '') {
      target.value = '0';
    }
  }

  async onSubmit() {
    const formattedEvent = {
      startDate: this.event.startDate,
      endDate: this.event.endDate,
      place: this.event.place,
      pendingSpeakerRequests: this.event.speakerEmails.map(email => ({
        email: email,
      })),
      topics: [...this.event.topics],
      title: this.event.title,
      maxParticipants: this.event.maxParticipants,
      registeredParticipants: 0,
      eventSubscription: this.event.eventType.toUpperCase() === 'FREE' ? 'FREE' : 'PAID',
      description: this.event.description,
    };

    console.log('Formatted Event Data:', formattedEvent);

    try {
      await this.eventsService.createEvent(formattedEvent);
      this.snackBar.open('Evento creato con successo!', 'Chiudi', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success-snackbar'
      });
      await this.router.navigate(['/partner-companies/' + this.host?.id]);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        console.error('Error creating event:', errorResponse);
        switch (errorResponse.status) {
          case 400:
            this.snackBar.open('Errore nei dati inseriti', 'Chiudi', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'error-snackbar'
            });
            break;
          case 401:
            this.snackBar.open('Non autorizzato', 'Chiudi', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'error-snackbar'
            });
            break;
          case 500:
            this.snackBar.open('Errore interno del server', 'Chiudi', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'error-snackbar'
            });
            break;
          default:
            this.snackBar.open('Errore durante la creazione dell\'evento', 'Chiudi', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'error-snackbar'
            });
        }
      }

    }
  }
}
