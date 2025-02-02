import { Component, OnInit } from '@angular/core';
import { EventsService, CategorizedEvents, Event } from '../events/events.service';
import { formatDate, NgForOf, NgIf } from '@angular/common';
import {EventFilterComponent} from '../../components/event-filter/event-filter.component';

@Component({
  selector: 'app-future-events',
  templateUrl: './future-events.component.html',
  styleUrls: ['./future-events.component.css'],
  imports: [NgIf, NgForOf, EventFilterComponent],
  standalone: true,
  providers: [EventsService]
})
export class FutureEventsComponent implements OnInit {
  futureEvents: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Filter options
  allTitles: string[] = [];
  allTopics: string[] = [];
  allHosts: string[] = [];

  // Current filters
  filters = {
    title: '',
    date: null,
    topic: '',
    host: '',
    subscription: ''
  };

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.fetchFutureEvents();
  }

  fetchFutureEvents(): void {
    this.eventsService.getCategorizedEvents().subscribe({
      next: (categorizedEvents: CategorizedEvents) => {
        this.futureEvents = categorizedEvents.future;
        this.filteredEvents = [...this.futureEvents];
        this.initializeFilterOptions();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero degli eventi.';
        this.isLoading = false;
      }
    });
  }

  initializeFilterOptions(): void {
    this.allTitles = [...new Set(this.futureEvents.map(event => event.title))];
    this.allTopics = [...new Set(this.futureEvents.flatMap(event => event.topics || []))];
    this.allHosts = [...new Set(this.futureEvents.map(event => event.host))];
  }

  applyFilters(newFilters: any): void {
    this.filters = newFilters;

    this.filteredEvents = this.futureEvents.filter(event => {
      const matchesTitle = this.filters.title ? event.title.toLowerCase().includes(this.filters.title.toLowerCase()) : true;
      const matchesDate = this.filters.date ? new Date(event.startDate).toDateString() === new Date(this.filters.date).toDateString() : true;
      const matchesTopic = this.filters.topic ? (event.topics || []).some(topic => topic.toLowerCase().includes(this.filters.topic.toLowerCase())) : true;
      const matchesHost = this.filters.host ? event.host.toLowerCase().includes(this.filters.host.toLowerCase()) : true;
      const matchesSubscription = this.filters.subscription ? event.eventSubscription === this.filters.subscription : true;

      return matchesTitle && matchesDate && matchesTopic && matchesHost && matchesSubscription;
    });
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      date: null,
      topic: '',
      host: '',
      subscription: ''
    };
    this.filteredEvents = [...this.futureEvents];
  }

  bookEvent(id: string): void {
    console.log(`Mock booking event with id: ${id}`);
    // Simulate booking logic here
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
