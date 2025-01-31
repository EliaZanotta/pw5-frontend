// src/app/pages/future-events/future-events.component.ts

import { Component, OnInit } from '@angular/core';
import { EventsService, CategorizedEvents, Event } from '../events/events.service';
import {formatDate, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-future-events',
  templateUrl: './future-events.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./future-events.component.css'],
  providers: [EventsService]
})
export class FutureEventsComponent implements OnInit {
  futureEvents: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.fetchFutureEvents();
  }

  fetchFutureEvents(): void {
    this.eventsService.getCategorizedEvents().subscribe({
      next: (categorizedEvents: CategorizedEvents) => {
        this.futureEvents = categorizedEvents.future;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero degli eventi.';
        this.isLoading = false;
      }
    });
  }

  bookEvent(id: string): void {
    console.log(`Mock booking event with id: ${id}`);
    // Simulate booking logic here
  }

  formatDate(date: string): string {
    // Your date formatting logic here
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
