import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {EventsService} from '../events/events.service';

@Component({
  selector: 'app-event-registration-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-registration-form.component.html',
  styleUrls: ['./event-registration-form.component.css'],
  standalone: true
})
export class EventRegistrationFormComponent {
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

  constructor(private eventsService: EventsService) {}

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
      })), topics: [...this.event.topics],
      title: this.event.title,
      maxParticipants: this.event.maxParticipants,
      registeredParticipants: 0,
      eventSubscription: this.event.eventType.toUpperCase() === 'FREE' ? 'FREE' : 'PAID',
      description: this.event.description,
    };

    console.log('Formatted Event Data:', formattedEvent);

    try {
      await this.eventsService.createEvent(formattedEvent);
      alert('Event created successfully!');
    } catch (error) {
      alert('Failed to create event. Please try again later.');
    }
  }
}
