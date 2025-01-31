// past-events.component.ts

import { Component, OnInit } from '@angular/core';
import { EventsService, CategorizedEvents, Event } from '../events/events.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-past-events',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css'],
  imports: [
    NgForOf,
    NgIf
  ],
  providers: [DatePipe]
})
export class PastEventsComponent implements OnInit {
  pastEvents: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private eventsService: EventsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.fetchPastEvents();
  }

  fetchPastEvents(): void {
    this.eventsService.getCategorizedEvents().subscribe({
      next: (categorizedEvents: CategorizedEvents) => {
        this.pastEvents = categorizedEvents.past;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching past events:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero degli eventi passati.';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd MMMM yyyy') || dateString;
  }
  bookEvent(id: string): void {
    console.log(`Mock booking event with id: ${id}`);
    // Simulate booking logic here
  }
}
