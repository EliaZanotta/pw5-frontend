import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../events/events.service';
import { AuthService } from '../../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-registration-form',
  standalone: true,
  templateUrl: './event-registration-form.component.html',
  styleUrls: ['./event-registration-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EventRegistrationFormComponent implements OnInit {
  event = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    place: '',
    speakerEmails: [] as string[],
    topics: [] as string[],
    maxParticipants: 0,
    eventType: 'free', 
    price: 0,
  };

  newTopic: string = '';
  newSpeakerEmail: string = '';

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    try {
      const response = await this.authService.getLoggedHost();
      if (response.host) {
        console.log('Host autenticato:', response.host);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        await this.router.navigate(['/login']);
      }
    }
  }

  addTopic() {
    if (this.newTopic.trim() && !this.event.topics.includes(this.newTopic.trim())) {
      this.event.topics.push(this.newTopic.trim());
      this.newTopic = '';
    }
  }

  removeTopic(index: number) {
    this.event.topics.splice(index, 1);
  }

  addSpeakerEmail() {
    if (this.newSpeakerEmail.trim() && !this.event.speakerEmails.includes(this.newSpeakerEmail.trim())) {
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

  async onSubmit(eventForm: NgForm) {
    if (!eventForm.valid) {
      this.snackBar.open('Compila tutti i campi richiesti!', 'Chiudi', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'error-snackbar'
      });
      return;
    }
  
    const formattedEvent = {
      title: this.event.title,
      description: this.event.description,
      startDate: this.event.startDate,
      endDate: this.event.endDate,
      place: this.event.place,
      topics: [...this.event.topics],
      pendingSpeakerRequests: this.event.speakerEmails.map(email => ({ email })), // ✅ Converti in array di oggetti
      maxParticipants: this.event.maxParticipants,
      eventSubscription: this.event.eventType.toUpperCase() === 'FREE' ? 'FREE' : 'PAID', // ✅ Aggiunto per il backend
      price: this.event.eventType === 'paid' ? this.event.price : 0, // ✅ Imposta il prezzo solo se a pagamento
    };
  
    console.log('Dati inviati al backend:', formattedEvent);
  
    try {
      await this.eventsService.createEvent(formattedEvent);
      this.snackBar.open('Evento creato con successo!', 'Chiudi', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success-snackbar'
      });
      await this.router.navigate(['/dashboard']);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.handleHttpError(errorResponse);
      }
    }
  }
  

  private handleHttpError(error: HttpErrorResponse) {
    console.error('Errore HTTP:', error);

    let message = 'Errore durante la creazione dell\'evento';
    switch (error.status) {
      case 400:
        message = 'Errore nei dati inseriti';
        break;
      case 401:
        message = 'Non autorizzato';
        break;
      case 500:
        message = 'Errore interno del server';
        break;
    }

    this.snackBar.open(message, 'Chiudi', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'error-snackbar'
    });
  }
}
