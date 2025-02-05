import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-registration-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-registration-form.component.html',
  styleUrls: ['./event-registration-form.component.css'],
})
export class EventRegistrationFormComponent {
  event = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    speakerEmails: [] as string[],
    topics: [] as string[],
    maxParticipants: 0,
    eventType: 'free', // Default value
    price: 0,
  };
  newTopic: string = '';
  newSpeakerEmail: string = '';

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

  onSubmit() {
    console.log('Event Data:', this.event);
    // Add your form submission logic here
  }
}
