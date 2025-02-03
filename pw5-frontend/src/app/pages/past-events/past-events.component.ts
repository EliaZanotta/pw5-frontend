import { Component, OnInit } from '@angular/core';
import { EventsService, CategorizedEvents, Event } from '../events/events.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {EventFilterComponent} from '../../components/event-filter/event-filter.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-past-events',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css'],
  imports: [NgForOf, NgIf, EventFilterComponent, RouterLink],
  standalone: true,
  providers: [DatePipe]
})
export class PastEventsComponent implements OnInit {
  pastEvents: Event[] = [];
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

  constructor(private eventsService: EventsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.fetchPastEvents();
  }

  fetchPastEvents(): void {
    this.eventsService.getCategorizedEvents().subscribe({
      next: (categorizedEvents: CategorizedEvents) => {
        this.pastEvents = categorizedEvents.past;
        this.filteredEvents = [...this.pastEvents];
        this.initializeFilterOptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching past events:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero degli eventi passati.';
        this.isLoading = false;
      }
    });
  }

  initializeFilterOptions(): void {
    this.allTitles = [...new Set(this.pastEvents.map(event => event.title))];
    this.allTopics = [...new Set(this.pastEvents.flatMap(event => event.topics || []))];
    this.allHosts = [...new Set(this.pastEvents.map(event => event.host))];
  }

  applyFilters(newFilters: any): void {
    this.filters = newFilters;

    this.filteredEvents = this.pastEvents.filter(event => {
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
    this.filteredEvents = [...this.pastEvents];
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
