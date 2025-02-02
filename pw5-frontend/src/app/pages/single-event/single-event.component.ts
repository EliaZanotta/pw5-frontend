import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendarDays, faMapPin, faTicket, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  standalone: true,
  imports: [FaIconComponent, NgForOf],
  styleUrls: ['./single-event.component.css'],
})
export class SingleEventComponent implements OnInit {
  eventData = {
    id: '679ebc97ecdb9565b83e8f15',
    startDate: '2023-01-27T10:00:00',
    endDate: '2026-01-27T11:00:00',
    place: 'Milano',
    speakers: [],
    topics: ['Technology', 'Innovation'],
    host: 'Simone COMPANY',
    title: 'Future Tech Summit',
    status: 'UPCOMING',
    pendingSpeakerRequests: [],
    maxParticipants: 300,
    registeredParticipants: 150,
    ticketIds: ['679ebcf8ecdb9565b83e8f18', '679ebcf8ecdb9565b83e8f19'],
    eventSubscription: 'PAID',
    image: '/assets/placeholder.svg',
  };

  // FontAwesome icons
  faCalendarDays = faCalendarDays;
  faMapPin = faMapPin;
  faUsers = faUsers;
  faTicket = faTicket;
  faUser = faUser;

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  ngOnInit(): void {}
}
